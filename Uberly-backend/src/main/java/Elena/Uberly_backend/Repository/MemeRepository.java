package Elena.Uberly_backend.Repository;

import Elena.Uberly_backend.Entity.Meme;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MemeRepository extends JpaRepository<Meme, Integer> {

    List<Meme> findAllByUserId(int userId);
}
