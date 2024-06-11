package Elena.Uberly_backend.Security;

import Elena.Uberly_backend.Entity.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
public class AuthenticationResponse {

    private String token;

    @JsonIgnoreProperties(value = "password")
    private User user;

    public AuthenticationResponse(String token, User user) {
        this.token = token;
        this.user = user;
    }
}
