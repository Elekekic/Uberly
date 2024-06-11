package Elena.Uberly_backend.Repository;

import Elena.Uberly_backend.Entity.Post;
import Elena.Uberly_backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Integer> {
    List<Post> findByUser(User user);
    List<Post> findByCity(String city);
}
