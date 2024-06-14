package Elena.Uberly_backend.DTO;

import Elena.Uberly_backend.Entity.Reaction;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class FeedbackDTO {

    @NotBlank(message = "The content cannot be empty")
    private String content;

    @Min(value = 1)
    private int authorId;

    @Min(value = 1)
    private int recipientId;

}
