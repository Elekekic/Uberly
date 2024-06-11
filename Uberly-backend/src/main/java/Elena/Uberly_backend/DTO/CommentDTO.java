package Elena.Uberly_backend.DTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CommentDTO {

    @NotBlank(message = "The content cannot be empty")
    private String content;

    @Min(value = 1)
    private Long postId;

    @Min(value = 1)
    private Long userId;

    @Min(value = 1)
    private Long parentCommentId;
}
