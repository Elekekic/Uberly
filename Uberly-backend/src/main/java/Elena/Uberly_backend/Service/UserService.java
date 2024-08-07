package Elena.Uberly_backend.Service;

import Elena.Uberly_backend.DTO.UserDTO;
import Elena.Uberly_backend.Entity.Meme;
import Elena.Uberly_backend.Entity.Post;
import Elena.Uberly_backend.Entity.User;
import Elena.Uberly_backend.Enum.Role;
import Elena.Uberly_backend.Exception.BadRequestException;
import Elena.Uberly_backend.Exception.MemeNotFoundException;
import Elena.Uberly_backend.Exception.PostNotFoundException;
import Elena.Uberly_backend.Exception.UserNotFoundException;
import Elena.Uberly_backend.Repository.MemeRepository;
import Elena.Uberly_backend.Repository.PostRepository;
import Elena.Uberly_backend.Repository.UserRepository;
import com.cloudinary.Cloudinary;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired(required = false)
    private UserRepository userRepository;

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private MemeRepository memeRepository;


    // QUERY - FIND USER BY USERNAME
    public User getUserByUsername(String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isPresent()) {
            return userOptional.get();
        } else {
            throw new UserNotFoundException("User with username: " + username + " not found");
        }
    }

    // QUERY - FIND USER BY USERNAME CONTAINING
    public List<User> getUserByUsernameContaining(String like) {
        return userRepository.findByUsernameContaining(like);
    }

    // QUERY - FIND USER BY EMAIL
    public User getUserByEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            return userOptional.get();
        } else {
            throw new UserNotFoundException("User with email: " + email + " not found");
        }
    }

    // QUERY - FIND FAVORITES BY USER ID
    public List<Post> getFavoritesByUserId(int userId) {
        return userRepository.findFavoritesByUserId(userId);
    }

    // QUERY - FIND FAVORITES BY USER ID
    public List<Meme> getFavoritesMemesByUserId(int userId) {
        return userRepository.findFavoritesMemesByUserId(userId);
    }

    // FIND USER BY ID METHOD
    public Optional<User> getUserById(int id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            return userRepository.findById(id);
        } else {
            throw new UserNotFoundException("User with id: " + id + " not found");
        }
    }

    // FIND ALL USERS W/ PAGINATION METHOD
    public Page<User> getUserConPaginazione(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return userRepository.findAll(pageable);
    }

    // FIND ALL USERS W/O PAGINATION METHOD
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    //SAVE USER METHOD
    public String saveUser(UserDTO userDTO) {


        Optional<User> userOptional = userRepository.findByEmail(userDTO.getEmail());

        if (userOptional.isPresent()) {
            throw new BadRequestException("This email is already associated with another account");

        } else {
            User user = new User();
            user.setUsername(userDTO.getUsername());
            user.setName(userDTO.getName());
            user.setBio(userDTO.getBio());
            user.setPronouns(userDTO.getPronouns());
            user.setSurname(userDTO.getSurname());
            user.setRole(userDTO.getRole());
            user.setEmail(userDTO.getEmail());
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            user.setPictureProfile("https://source.boringavatars.com/beam/120/" +user.getName()+ "?colors=ff6d1f,f5e7c6,#faf3e1" );
            userRepository.save(user);
            sendMailProfileCreated(user.getEmail(), user.getName(), user.getSurname(), String.valueOf(user.getRole()));
            return "User with ID: " + user.getId() + " , with role: " + user.getRole();
        }
    }

    // UPDATE USER METHOD
    public User updateUser(UserDTO userUpdate, int id) {
        Optional<User> userOpt = getUserById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setUsername(userUpdate.getUsername());
            user.setName(userUpdate.getName());
            user.setBio(userUpdate.getBio());
            user.setPronouns(userUpdate.getPronouns());
            user.setSurname(userUpdate.getSurname());
            user.setRole(userUpdate.getRole());
            user.setEmail(userUpdate.getEmail());
            user.setPassword(userOpt.get().getPassword());

            if (user.getPictureProfile() == null || user.getPictureProfile().isEmpty()) {
                user.setPictureProfile("https://source.boringavatars.com/beam/120/" +user.getName()+ "?colors=ff6d1f,f5e7c6,#faf3e1" );
            }
            // sendMailProfileUpdated(user.getEmail(), user.getName(), user.getSurname(), String.valueOf(user.getRole()));
            return userRepository.save(user);

        } else {
            throw new UserNotFoundException("User with id: " + id + " hasn't been found");
        }
    }


    // DELETE USER METHOD
    public String deleteUser(int id) throws UserNotFoundException {
        Optional<User> userOpt = getUserById(id);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // Remove user from following lists of other users
            for (User followedUser : user.getFollowing()) {
                followedUser.getFollowers().remove(user);
            }

            // Remove user from followers lists of other users
            for (User follower : user.getFollowers()) {
                follower.getFollowing().remove(user);
            }

            // Remove references to user's memes in saved_memes table
            for (Meme meme : user.getMemes()) {
                for (User u : meme.getUsersWhoSaved()) {
                    u.getFavoritesMemes().remove(meme);
                }
            }

            // Clear the user's favorites lists
            user.getFavorites().clear();
            user.getFavoritesMemes().clear();

            // Clear user's comments
            user.getComments().clear();

            // Clear user's memes
            user.getMemes().clear();

            // Clear user's posts
            user.getPosts().clear();

            // Clear the user's followers and following lists
            user.getFollowers().clear();
            user.getFollowing().clear();

            // Delete the user
            userRepository.delete(user);

            return "User with id: " + id + " has been deleted";
        } else {
            throw new UserNotFoundException("User with ID: " + id + " hasn't been found");
        }
    }

    public List<User> getAllFollowers(int userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return user.getFollowers();
        } else {
            throw new UserNotFoundException("User not found");
        }
    }

    public List<User> getAllFollowings(int userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return user.getFollowing();
        } else {
            throw new UserNotFoundException("User not found");
        }
    }

    public void followUser(int userId, int followUserId) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<User> followUserOpt = userRepository.findById(followUserId);

        if (userOpt.isPresent() && followUserOpt.isPresent()) {
            User user = userOpt.get();
            User followUser = followUserOpt.get();
            user.followUser(followUser);
            userRepository.save(user);
            userRepository.save(followUser);
        } else {
            throw new UserNotFoundException("User not found");
        }
    }

    public void unfollowUser(int userId, int unfollowUserId) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<User> unfollowUserOpt = userRepository.findById(unfollowUserId);

        if (userOpt.isPresent() && unfollowUserOpt.isPresent()) {
            User user = userOpt.get();
            User unfollowUser = unfollowUserOpt.get();
            user.unfollowUser(unfollowUser);
            userRepository.save(user);
            userRepository.save(unfollowUser);
        } else {
            throw new UserNotFoundException("User not found");
        }
    }


    // ADD TO FAVS METHOD
    public void addSavedPost(int userId, int postId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found"));
        Post post = postRepository.findById(postId).orElseThrow(() -> new PostNotFoundException("Post not found"));

        if (user.getFavorites().contains(post)) {
            throw new BadRequestException("Post already in favorites");
        }
        user.getFavorites().add(post);
        post.getUsersWhoSaved().add(user);

        userRepository.save(user);
        postRepository.save(post);
    }

    // REMOVE FROM FAVS METHOD
    public void removeSavedPost(int userId, int postId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found"));
        Post post = postRepository.findById(postId).orElseThrow(() -> new PostNotFoundException("Post not found"));

        if (!user.getFavorites().contains(post)) {
            throw new BadRequestException("Post not in favorites");
        }

        user.getFavorites().remove(post);
        post.getUsersWhoSaved().remove(user);

        userRepository.save(user);
        postRepository.save(post);
    }

    // GET FAVS POSTS METHOD
    public List<Post> getSavedPosts(int userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found"));
        return user.getFavorites();
    }

    // ADD MEME TO FAVS METHOD
    public void addSavedMeme(int userId, int memeId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found"));
        Meme meme = memeRepository.findById(memeId).orElseThrow(() -> new MemeNotFoundException("Meme not found"));

        if (user.getFavoritesMemes().contains(meme)) {
            throw new BadRequestException("Meme already in favorites");
        }

        user.getFavoritesMemes().add(meme);
        meme.getUsersWhoSaved().add(user);

        userRepository.save(user);
        memeRepository.save(meme);
    }

    // REMOVE MEME FROM FAVS METHOD
    public void removeSavedMeme(int userId, int memeId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found"));
        Meme meme = memeRepository.findById(memeId).orElseThrow(() -> new MemeNotFoundException("Meme not found"));

        if (!user.getFavoritesMemes().contains(meme)) {
            throw new RuntimeException("Meme not in favorites");
        }

        user.getFavoritesMemes().remove(meme);
        meme.getUsersWhoSaved().remove(user);

        userRepository.save(user);
        memeRepository.save(meme);
    }

    // PATCH USER PROFILE PIC METHOD
    public String patchPictureProfileUser(int id, MultipartFile pictureProfile) throws UserNotFoundException, IOException {
        Optional<User> userOptional = getUserById(id);
        if (userOptional.isPresent()) {
            String url = (String) cloudinary.uploader().upload(pictureProfile.getBytes(), Collections.emptyMap()).get("url");
            User user = userOptional.get();
            user.setPictureProfile(url);
            userRepository.save(user);
            return url;
        } else {
            throw new UserNotFoundException("Impossible to update profile picture, user with id: " + id + " not found");
        }
    }


    // SEND EMAIL "PROFILE CREATED" METHOD
    private void sendMailProfileCreated(String email, String name, String surname, String role) {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject(String.format("Hold onto your seats! a new %s is here! \uD83E\uDEE3", role));


            LocalDate currentDate = LocalDate.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy");
            String formattedDate = currentDate.format(formatter);

            String htmlMsg = String.format(
                    "<html>" +
                            "<body style='text-align: center; font-family: Poppins, sans-serif;'>" +
                            "<div style='display: inline-block; width: 80%%; max-width: 700px; margin: 20px auto; padding: 20px; border: 1px solid black; border-radius: 20px; text-align: left;'>" +
                            "<img src='cid:welcomeImage' style='width: 100%%; height: auto; max-width: 900px; border-radius: 16px;'>" +
                            "<p>%s 🗓 </p>" +
                            "<h1 style='font-size: 30px; color: #FF6D1F;'>Dear %s %s,</h1>" +
                            "<h3>Your Uberly account has been successfully created! Congrats! 🎉<br>" +
                            "We can't wait to see you on our platform!</h3>" +
                            "<p>You can now access the system using the credentials you provided during registration. Remember, you are a <strong>%s</strong> of Uberly. If you have any questions or need assistance, please do not hesitate to contact us at <a href=\"mailto:uberlyteam@gmail.com\">uberlyteam@gmail.com</a> 📩</p>" +
                            "<p>Thank you for registering! Enjoy your journeys with new people. 📌</p>" +
                            "<p>Best regards,</p>" +
                            "<p>The Uberly Team</p>" +
                            "<img src='cid:logoImage' style='width: 200px; height: auto;'>" +
                            "<p style='font-size: 12px; margin-top: 20px;'>© 2024 Uberly Team</p>" +
                            "<p style='font-size: 12px;'>Trieste, Italy</p>" +
                            "</div>" +
                            "</body>" +
                            "</html>", formattedDate, name, surname, role);


            helper.setText(htmlMsg, true);

            ClassPathResource imageResource = new ClassPathResource("static/images/welcome.jpg");
            helper.addInline("welcomeImage", imageResource);

            ClassPathResource imageResource2 = new ClassPathResource("static/images/logo.png");
            helper.addInline("logoImage", imageResource2);

            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            logger.error("Error sending email to {}", email, e);
        }
    }

//    // SEND EMAIL "PROFILE UPDATED" METHOD
//    private void sendMailProfileUpdated(String email, String name, String surname, String role) {
//        try {
//            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
//            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
//
//            helper.setTo(email);
//            helper.setSubject("Uberly Account has been updated");
//
//            String htmlMsg = String.format("""
//                    <html>
//                    <body>
//                        <h1>Dear %s %s, </h1>
//                        <p>Your Uberly account has been successfully updated! </p>
//                        <p>Remember, you are a %s of Uberly.</p>
//                        <p>If you haven't changed or forgot any of your credentials, please do not hesitate to contact us at <a href="mailto:uberlyteam@gmail.com">uberlyteam@gmail.com</a>.</p>
//                        <p>Best regards,</p>
//                        <p>The Uberly Team</p>
//                        <img src='cid:logoImage' style='width: 200px; height: auto;'>
//                    </body>
//                    </html>
//                    """, name, surname, role);
//
//            helper.setText(htmlMsg, true);
//
//            ClassPathResource imageResource2 = new ClassPathResource("static/images/logo.png");
//            helper.addInline("logoImage", imageResource2);
//
//            javaMailSender.send(mimeMessage);
//        } catch (MessagingException e) {
//            logger.error("Error sending email to {}", email, e);
//        }
//    }
}
