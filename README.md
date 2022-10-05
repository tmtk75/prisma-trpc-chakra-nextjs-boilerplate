# Create T3 App + aws-sdk v3 + Dockerfile
This repository was generated with `yarn create t3-app`.
Then a Dockerfile and aws-sdk v3 were added as a sample.


# Getting Started to work
Just try the below commands, then open <http://localhsot:3000>.
```
[0]$ docker compose up localstack postgres
...

  # expected to work:
  #   % PGPASSWORD=abc123 psql -h 127.0.0.1 -U admin example
  #   % ..ra-nextjs-boilerplate on main% aws --endpoint-url=http://127.0.0.1:4566 s3 ls ; echo $?

[1]$ yarn
...

[1]$ yarn prisma migrate dev -n initial
...

[1]$ aws --endpoint-url=http://localhost:4566 s3api create-bucket --bucket foobar --region us-east-1
{
    "Location": "/foobar"
}

[1]$ yarn dev
...
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
...
```
Next.js dev-server starts using postgresql and s3@localstack served by docker-compose.


# Build docker image
```
$ docker build -t t3-app .
...

$ docker compose -f docker-compose.yml -f t3-app.yml up -d
...

$ open http://localhost:3000
```
```
$ aws --endpoint-url=http://localhost:4566 s3api create-bucket --bucket foobar --region us-east-1
