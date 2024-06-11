package Elena.Uberly_backend.Service;

import Elena.Uberly_backend.DTO.UserDTO;
import Elena.Uberly_backend.Entity.User;
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
            user.setPictureProfile(userDTO.getPictureProfile());

            user.setEmail(userDTO.getEmail());
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            user.setRole(userDTO.getRole());
            userRepository.save(user);
            sendMailProfileCreated(user.getEmail());
            return "User with ID: " + user.getId()+" , with role: "+ user.getRole();
        }
    }

    // UPDATE USER METHOD
    public User updateUser(UserDTO userUpdate, int id) throws UserNotFoundException {
        Optional<User> userOpt = getUserById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setUsername(userUpdate.getUsername());
            user.setName(userUpdate.getName());
            user.setSurname(userUpdate.getSurname());
            user.setEmail(userUpdate.getEmail());
            user.setPassword(passwordEncoder.encode(userUpdate.getPassword()));
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
            throw new UserNotFoundException("User with id: " + id + " hasn't been found");
        }


    }



    // PATCH USER PROFILE PIC METHOD
    public String patchPictureProfileUser(int id, MultipartFile foto) throws UserNotFoundException, IOException {
        Optional<User> userOptional = getUserById(id);
        if (userOptional.isPresent()){
            String url =(String) cloudinary.uploader().upload(foto.getBytes(), Collections.emptyMap()).get("url");
            User user = userOptional.get();
            user.setPictureProfile(url);
            userRepository.save(user);
            return "Immagine profilo aggiornata!";
        }else{
            throw new UserNotFoundException("Impossibile impostare immagine del profilo, non è stato trovato nessun utente con matricola: "+id);
        }
    }


    private void sendMailProfileCreated(String email) {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("Uberly Account Successfully Created");

            String htmlMsg = """
                    <html>
                    <body>
                        <img src='cid:logoImage'>
                        <p>Your Uberly account has been successfully created!</p>
                        <p>You can now access the system using the credentials you provided during registration.</p>
                        <p>If you have any questions or need assistance, please do not hesitate to contact us at <a href="mailto:support@uberly.com">support@uberly.com</a>.</p>
                        <p>Thank you for registering with Uberly!</p>
                        <p>Best regards,</p>
                        <p>The Uberly Team</p>
                    </body>
                    </html>
                    """;

            helper.setText(htmlMsg, true);

            // Add the inline image, assuming you have the image file in the resources folder
            ClassPathResource imageResource = new ClassPathResource("static/images/logo.png");
            helper.addInline("logoImage", imageResource);

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
