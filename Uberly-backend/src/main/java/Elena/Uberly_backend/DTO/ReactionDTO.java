package Elena.Uberly_backend.DTO;

import Elena.Uberly_backend.Enum.ReactionType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReactionDTO {

    @Min(value = 1)
    private int userId;

    @NotNull(message = "Type must not be null")
    private ReactionType type;
}
