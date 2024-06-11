package Elena.Uberly_backend.Service;

import Elena.Uberly_backend.DTO.UserLoginDTO;
import Elena.Uberly_backend.Entity.User;
import Elena.Uberly_backend.Exception.UnauthorizedException;
import Elena.Uberly_backend.Security.AuthenticationResponse;
import Elena.Uberly_backend.Security.JwtTool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserService userService;
    @Autowired
    private JwtTool jwtTool;
    @Autowired
    private PasswordEncoder passwordEncoder;


    public AuthenticationResponse authenticateUserAndCreateToken(UserLoginDTO userLoginDTO){
        User user = userService.getUserByEmail(userLoginDTO.getEmail());

        if (passwordEncoder.matches(userLoginDTO.getPassword() ,user.getPassword())) {

            String token = jwtTool.createToken(user);

            return new AuthenticationResponse(token,user);
        }else{
            throw  new UnauthorizedException("Errors in the credentials, please check them again");
        }
    }

}
