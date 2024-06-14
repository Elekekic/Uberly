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
            user.setPictureProfile("https://ui-avatars.com/api/?name=" + user.getName() + "+" + user.getSurname());
            userRepository.save(user);
            // sendMailProfileCreated(user.getEmail(), user.getName(), user.getSurname(), String.valueOf(user.getRole()));
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
            user.setPassword(passwordEncoder.encode(userUpdate.getPassword()));

            if (user.getPictureProfile() == null || user.getPictureProfile().isEmpty()) {
                user.setPictureProfile("https://ui-avatars.com/api/?name=" + user.getName() + "+" + user.getSurname());
            }
            sendMailProfileUpdated(user.getEmail(), user.getName(), user.getSurname(), String.valueOf(user.getRole()));
            return userRepository.save(user);

        } else {
            throw new UserNotFoundException("User with id: " + id + " hasn't been found");
        }
    }


    // DELETE USER METHOD
    public String deleteUser(int id) throws UserNotFoundException {
        Optional<User> userOpt = getUserById(id);

        if (userOpt.isPresent()) {
            userRepository.delete(userOpt.get());
            return "User with id: " + id + " has been deleted";
        } else {
            throw new UserNotFoundException("User with ID: " + id + " hasn't been found");
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
            return "Profile picture updated!";
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
            helper.setSubject("Uberly Account successfully created");

            String htmlMsg = String.format("""
                    <html>
                    <body>
                        <img src='cid:welcomeImage' style='width: 800px; height: auto;'>
                        <h1>Dear %s %s, </h1>
                        <p> your Uberly account has been successfully created! </p>
                        <p>You can now access the system using the credentials you provided during registration. Remember, you are a %s of Uberly.</p>
                        <p>If you have any questions or need assistance, please do not hesitate to contact us at <a href="mailto:uberlyteam@gmail.com">uberlyteam@gmail.com</a>.</p>
                        <p>Thank you for registering! Enjoy your journeys with new people.</p>
                        <p>Best regards,</p>
                        <p>The Uberly Team</p>
                        <img src='cid:logoImage' style='width: 200px; height: auto;'>
                    </body>
                    </html>
                    """, name, surname, role);

            helper.setText(htmlMsg, true);


            ClassPathResource imageResource = new ClassPathResource("static/images/welcome.png");
            helper.addInline("welcomeImage", imageResource);

            ClassPathResource imageResource2 = new ClassPathResource("static/images/logo.png");
            helper.addInline("logoImage", imageResource2);

            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            logger.error("Error sending email to {}", email, e);
        }
    }

    // SEND EMAIL "PROFILE UPDATED" METHOD
    private void sendMailProfileUpdated(String email, String name, String surname, String role) {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("Uberly Account has been updated");

            String htmlMsg = String.format("""
                    <html>
                    <body>
                        <h1>Dear %s %s, </h1>
                        <p>Your Uberly account has been successfully updated! </p>
                        <p>Remember, you are a %s of Uberly.</p>
                        <p>If you haven't changed or forgot any of your credentials, please do not hesitate to contact us at <a href="mailto:uberlyteam@gmail.com">uberlyteam@gmail.com</a>.</p>
                        <p>Best regards,</p>
                        <p>The Uberly Team</p>
                        <img src='cid:logoImage' style='width: 200px; height: auto;'>
                    </body>
                    </html>
                    """, name, surname, role);

            helper.setText(htmlMsg, true);

            ClassPathResource imageResource2 = new ClassPathResource("static/images/logo.png");
            helper.addInline("logoImage", imageResource2);

            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            logger.error("Error sending email to {}", email, e);
        }
    }
}
