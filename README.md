# Protecting your FastAPI API with Auth0

You can change this behavior by setting the following environment variables (remember to update the values accordingly) in .config archive:

DOMAIN='your.domain.auth0.com'
API_AUDIENCE='your.api.audience'
ISSUER='https://your.domain.auth0.com'
ALGORITHMS='RS256'


To execute the container of the web application in windows

1. Create the image of the project:

``` console
docker build -t ecommerce .
```
2. Run the container based on the previous image:

``` console
docker run -d --name ecommerce_container -p 80:80 ecommerce
```