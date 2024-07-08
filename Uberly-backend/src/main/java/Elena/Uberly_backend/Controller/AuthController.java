package Elena.Uberly_backend.Controller;

import Elena.Uberly_backend.DTO.UserDTO;
import Elena.Uberly_backend.DTO.UserLoginDTO;
import Elena.Uberly_backend.Exception.BadRequestException;
import Elena.Uberly_backend.Security.AuthenticationResponse;
import Elena.Uberly_backend.Service.AuthService;
import Elena.Uberly_backend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "https://outer-lane-kekice-635da50d.koyeb.app")

public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;


    @PostMapping("/signup")
    public String signup(@RequestBody @Validated UserDTO userDTO, BindingResult bindingResult){
        if (bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(DefaultMessageSourceResolvable::getDefaultMessage).reduce("",(s, s2) -> s+s2 ));
        }

        return userService.saveUser(userDTO);
    }

    @PostMapping("/login")
    public AuthenticationResponse login(@RequestBody @Validated UserLoginDTO userLoginDTO, BindingResult bindingResult){
        if (bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(DefaultMessageSourceResolvable::getDefaultMessage).reduce("",(s, s2) -> s+s2 ));
        }

        return authService.authenticateUserAndCreateToken(userLoginDTO);
    }
}
