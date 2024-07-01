package Elena.Uberly_backend.DTO;


import Elena.Uberly_backend.Entity.User;
import Elena.Uberly_backend.Enum.Tags;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class PostDTO {


    @NotBlank(message = "The title cannot be empty")
    private String title;

    @NotBlank(message = "The description cannot be empty")
    private String description;

    @NotBlank(message = "The starting point cannot be empty")
    private String startingPoint;

    @NotBlank(message = "The end point cannot be empty")
    private String endPoint;

   @Min(value = 1)
    private int spacesRiders;

    @NotNull(message = "The tags must not be null")
    private List<Tags> tags;

    @NotBlank(message = "You must say which vehicle you have")
    private String vehicle;

   @Min(value = 1)
    private int userId;
}
