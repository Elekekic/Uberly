package Elena.Uberly_backend.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FeedbackUpdateDTO {

    @NotBlank(message = "The content cannot be empty")
    private String content;
}
