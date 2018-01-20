package judgels.jophiel.session;

import javax.persistence.Column;
import javax.persistence.Entity;
import judgels.persistence.UnmodifiableModel;

@SuppressWarnings("checkstyle:visibilitymodifier")
@Entity(name = "jophiel_session")
public class SessionModel extends UnmodifiableModel {
    @Column(unique = true, nullable = false)
    public String token;

    @Column(nullable = false)
    public String userJid;
}
