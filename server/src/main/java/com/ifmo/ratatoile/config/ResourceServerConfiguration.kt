package com.ifmo.ratatoile.config

import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer

@Configuration
@EnableResourceServer
class ResourceServerConfiguration : ResourceServerConfigurerAdapter() {

  override fun configure(resources: ResourceServerSecurityConfigurer) {
    resources.resourceId(RESOURCE_ID)
  }

  @Throws(Exception::class)
  override fun configure(http: HttpSecurity) {
    http.requestMatchers()
        .antMatchers(UNSECURED_PATTERN).and().authorizeRequests()
        .anyRequest().permitAll()
        .and()
        .requestMatchers()
        .antMatchers(SECURED_PATTERN).and().authorizeRequests()
        .anyRequest().authenticated()
  }

  companion object {

    private const val RESOURCE_ID = "resource-server-rest-api"
    private const val SECURED_PATTERN = "/api/**"
    private const val UNSECURED_PATTERN = "/**"
  }
}
