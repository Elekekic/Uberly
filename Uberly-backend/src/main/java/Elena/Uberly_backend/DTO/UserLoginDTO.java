package Elena.Uberly_backend.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserLoginDTO {

    @Email(message = "Inserire l'email")
    private String email;

    @NotBlank(message = "Inserire la password")
    private String password;
}
