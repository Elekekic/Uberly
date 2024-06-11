package Elena.Uberly_backend.Service;

import Elena.Uberly_backend.DTO.UserDTO;
import Elena.Uberly_backend.Entity.User;
import Elena.Uberly_backend.Enum.Role;
import Elena.Uberly_backend.Exception.BadRequestException;
import Elena.Uberly_backend.Exception.UserNotFoundException;
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

    public User getUserByUsername(String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isPresent()) {
            return userOptional.get();
        } else {
            throw new UserNotFoundException("User with username: " + username + " not found");
        }
    }

    public User getUserByEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            return userOptional.get();
        } else {
            throw new UserNotFoundException("User with email: " + email + " not found");
        }
    }

    public Optional<User> getUserById(int id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            return userRepository.findById(id);
        } else {
            throw new UserNotFoundException("User with id: " + id + " not found");
        }
    }

    public Page<User> getUserConPaginazione(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return userRepository.findAll(pageable);
    }

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
            user.setSurname(userDTO.getSurname());
            user.setPictureProfile("https://ui-avatars.com/api/?name=" + user.getName() + "+" + user.getSurname());
            user.setEmail(userDTO.getEmail());
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            user.setRole(userDTO.getRole());
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
            user.setSurname(userUpdate.getSurname());
            user.setEmail(userUpdate.getEmail());
            user.setPassword(passwordEncoder.encode(userUpdate.getPassword()));

            if (userUpdate.getRole() != null) {
                user.setRole(userUpdate.getRole());
            }

            if (user.getPictureProfile() == null || user.getPictureProfile().isEmpty()) {
                user.setPictureProfile("https://ui-avatars.com/api/?name=" + user.getName() + "+" + user.getSurname());
            }

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



    // PATCH USER PROFILE PIC METHOD
    public String patchPictureProfileUser(int id, MultipartFile pictureProfile) throws UserNotFoundException, IOException {
        Optional<User> userOptional = getUserById(id);
        if (userOptional.isPresent()){
            String url =(String) cloudinary.uploader().upload(pictureProfile.getBytes(), Collections.emptyMap()).get("url");
            User user = userOptional.get();
            user.setPictureProfile(url);
            userRepository.save(user);
            return "Profile picture updated!";
        }else{
            throw new UserNotFoundException("Impossible to update profile picture, user with id: "+ id + " not found");
        }
    }


    private void sendMailProfileCreated(String email, String name, String surname, String role) {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("Uberly Account Successfully Created");

            String htmlMsg = String.format("""
            <html>
            <body>
                <img src='cid:welcomeImage' style='width: 800px; height: auto;'>
                <p>Dear %s %s, your Uberly account has been successfully created!</p>
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



    private void sendMailModifyPassword(String email) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Richiesta modifica password");
        message.setText("Attenzione, la tua password è stata modificata, se non sei stato tu a richiederlo, invia una segnalazione!");

        javaMailSender.send(message);
    }


}
