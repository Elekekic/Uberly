package Elena.Uberly_backend.Controller;

import Elena.Uberly_backend.Entity.Meme;
import Elena.Uberly_backend.Entity.Post;
import Elena.Uberly_backend.Service.MemeService;
import Elena.Uberly_backend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "https://uberly-gamma.vercel.app")
public class MemeController {

    @Autowired
    private MemeService memeService;

    @Autowired
    private UserService userService;

    @GetMapping("/memes")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public List<Meme> getAllMemes() {
        return memeService.getAllMemes();
    }

    @GetMapping("users/{id}/memes")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public List<Meme> getAllMemesByUserId(@PathVariable int id) {
        return memeService.getAllMemesByUserId(id);
    }

    @GetMapping("/memes/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public Optional<Meme> getMemeById(@PathVariable int id) {
        return memeService.findMemeById(id);
    }

    @PostMapping("users/{id}/memes")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public String saveMeme(@PathVariable int id, @RequestBody MultipartFile url) throws IOException {
        return memeService.saveMeme(id, url);
    }

    @PatchMapping("/memes/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public String updateMeme(@PathVariable int id, @RequestBody MultipartFile url) throws IOException {
        return memeService.patchMemeUrl(id, url);
    }


    @DeleteMapping("/memes/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'DRIVER', 'RIDER')")
    public String deleteMeme(@PathVariable int id) {
        return memeService.deleteMeme(id);
    }
}
