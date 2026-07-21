# Build stage: install CPAN deps into a local lib (build deps included).
FROM ghcr.io/quenchworks/images/perl:5.44.0 AS build
USER root
WORKDIR /app
ENV PERL_CPANM_HOME=/tmp/cpanm

COPY cpanfile ./
RUN ["cpanm", "--notest", "--local-lib=/app/local", "--installdeps", "."]
COPY . .

# Runtime stage: copy the local lib + app onto a clean perl base.
FROM ghcr.io/quenchworks/images/perl:5.44.0 AS runtime
WORKDIR /app
ENV PERL5LIB=/app/local/lib/perl5 \
    PATH="/app/local/bin:$PATH"
COPY --from=build /app /app
USER 1001
EXPOSE 5000
CMD ["perl", "app.pl"]