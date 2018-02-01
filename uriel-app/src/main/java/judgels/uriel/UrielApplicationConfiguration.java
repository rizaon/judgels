package judgels.uriel;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.palantir.websecurity.WebSecurityConfigurable;
import com.palantir.websecurity.WebSecurityConfiguration;
import io.dropwizard.Configuration;
import io.dropwizard.db.DataSourceFactory;

public class UrielApplicationConfiguration extends Configuration implements WebSecurityConfigurable {
    private final DataSourceFactory databaseConfig;
    private final WebSecurityConfiguration webSecurityConfig;

    public UrielApplicationConfiguration(
            @JsonProperty("database") DataSourceFactory databaseConfig,
            @JsonProperty("webSecurity") WebSecurityConfiguration webSecurityConfig) {

        this.databaseConfig = databaseConfig;
        this.webSecurityConfig = webSecurityConfig;
    }

    public DataSourceFactory getDatabaseConfig() {
        return databaseConfig;
    }

    @Override
    public WebSecurityConfiguration getWebSecurityConfiguration() {
        return webSecurityConfig;
    }
}
