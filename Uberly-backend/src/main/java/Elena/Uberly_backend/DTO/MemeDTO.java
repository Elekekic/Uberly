package Elena.Uberly_backend.DTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MemeDTO {

    @NotNull
    private String url;

    @NotNull
    private String tag;

    @Min(value = 1)
    private int userId;
}
