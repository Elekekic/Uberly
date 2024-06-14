package Elena.Uberly_backend.DTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReplyDTO {

    @NotBlank(message = "The content cannot be empty")
    private String content;

    @Min(value = 1)
    private int commentId;

    @Min(value = 1)
    private int userId;
}
