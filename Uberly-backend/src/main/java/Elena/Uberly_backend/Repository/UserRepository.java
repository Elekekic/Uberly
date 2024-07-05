package Elena.Uberly_backend.Repository;

import Elena.Uberly_backend.Entity.Post;
import Elena.Uberly_backend.Entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Integer> {

    public Optional<User> findByEmail(String email);
    public Optional<User> findByUsername(String username);

    public List<User> findByUsernameContaining (String like);

    @Query("SELECT u.favorites FROM User u WHERE u.id = :userId")
    List<Post> findFavoritesByUserId(@Param("userId") int userId);
}
