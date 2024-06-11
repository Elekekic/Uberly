package Elena.Uberly_backend.DTO;


import Elena.Uberly_backend.Entity.User;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PostDTO {


    @NotBlank(message = "The title cannot be empty")
    @Size(max = 30, message = "The name cannot be over the 30 characters")
    private String title;

    @NotBlank(message = "The description cannot be empty")
    private String description;

    @NotBlank(message = "The city cannot be empty")
    private String city;

    @Min(value = 1)
    private int userId;
}
