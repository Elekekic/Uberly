package Elena.Uberly_backend.DTO;

import Elena.Uberly_backend.Enum.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserDTO {

    @Size(max = 15, message = "The username cannot be over the 15 characters")
    private String username;

    @NotBlank
    @Size(max = 30, message = "The name cannot be over the 30 characters")
    private String name;

    @NotBlank
    private String bio;

    private String pronouns;

    @NotBlank(message = "The surname cannot be empty")
    @Size(max = 30, message = "The surname cannot be over the 30 characters")
    private String surname;

    @NotNull(message = "Role must not be null")
    private Role role;

    @Email(regexp ="(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])" )
    @NotBlank
    private String email;

    @NotBlank(message = "Please enter your password")
    private String password;


    private String pictureProfile;
}
