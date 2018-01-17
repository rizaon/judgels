package judgels.persistence;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@SuppressWarnings("checkstyle:visibilitymodifier")
@MappedSuperclass
public abstract class Model extends UnmodifiableModel {
    public String updatedBy;

    public String updatedIp;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    public Date updatedAt;
}
