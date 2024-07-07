package Elena.Uberly_backend.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserLoginDTO {

    @Email(message = "Email has to be valid")
    private String email;

    @NotBlank(message = "Password cannot be empty")
    private String password;
}
