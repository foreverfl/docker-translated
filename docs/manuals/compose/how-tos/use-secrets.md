---
title: Docker Compose에서 비밀 사용 방법
linkTitle: Compose에서 비밀
weight: 60
description: Compose에서 비밀을 사용하는 방법과 그 이점
keywords:
  - 비밀
  - compose
  - 보안
  - 환경 변수
tags: [Secrets]
aliases:
  - /compose/use-secrets/
---

비밀은 비밀번호, 인증서 또는 API 키와 같이 네트워크를 통해 전송되거나 Dockerfile 또는 애플리케이션 소스 코드에 암호화되지 않은 상태로 저장되지 않아야 하는 모든 데이터입니다.

<Include file="compose/secrets.md" />

환경 변수는 종종 모든 프로세스에서 사용할 수 있으며 액세스를 추적하기 어려울 수 있습니다. 또한 오류를 디버깅할 때 모르는 사이에 로그에 출력될 수 있습니다. 비밀을 사용하면 이러한 위험을 완화할 수 있습니다.

## 비밀 사용 {#use-secrets}

비밀은 컨테이너 내부의 `/run/secrets/<secret_name>` 파일로 마운트됩니다.

비밀을 컨테이너에 넣는 것은 두 단계로 이루어집니다. 먼저, [Compose 파일의 최상위 비밀 요소](/reference/compose-file/secrets.md)를 사용하여 비밀을 정의합니다. 다음으로, [secrets 속성](/reference/compose-file/services.md#secrets)을 사용하여 서비스 정의를 업데이트하여 필요한 비밀을 참조합니다. Compose는 서비스별로 비밀에 대한 액세스를 허용합니다.

다른 방법과 달리, 이는 표준 파일 시스템 권한을 통해 서비스 컨테이너 내에서 세분화된 액세스 제어를 허용합니다.

## 예제 {#examples}

### 간단한 예제 {#simple}

다음 예제에서, frontend 서비스는 `my_secret` 비밀에 대한 액세스 권한을 부여받습니다. 컨테이너에서 `/run/secrets/my_secret`은 `./my_secret.txt` 파일의 내용으로 설정됩니다.

```yaml
services:
  myapp:
    image: myapp:latest
    secrets:
      - my_secret
secrets:
  my_secret:
    file: ./my_secret.txt
```

### 고급 예제 {#advanced}

```yaml
services:
  db:
    image: mysql:latest
    volumes:
      - db_data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD_FILE: /run/secrets/db_root_password # 비밀 파일 경로
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD_FILE: /run/secrets/db_password # 비밀 파일 경로
    secrets:
      - db_root_password
      - db_password

  wordpress:
    depends_on:
      - db
    image: wordpress:latest
    ports:
      - "8000:80"
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD_FILE: /run/secrets/db_password # 비밀 파일 경로
    secrets:
      - db_password

secrets:
  db_password:
    file: db_password.txt
  db_root_password:
    file: db_root_password.txt

volumes:
  db_data:
```

위의 고급 예제에서:

- 각 서비스 아래의 `secrets` 속성은 특정 컨테이너에 주입하려는 비밀을 정의합니다.
- 최상위 `secrets` 섹션은 `db_password` 및 `db_root_password` 변수를 정의하고 해당 값을 채우는 `file`을 제공합니다.
- 각 컨테이너의 배포는 Docker가 특정 값으로 `/run/secrets/<secret_name>` 아래에 임시 파일 시스템 마운트를 생성함을 의미합니다.

:::note
여기서 보여준 `_FILE` 환경 변수는 [mysql](https://hub.docker.com/_/mysql) 및 [postgres](https://hub.docker.com/_/postgres)와 같은 Docker 공식 이미지에서 사용되는 관례입니다.
:::

### 빌드 비밀 {#build-secrets}

다음 예제에서, `npm_token` 비밀은 빌드 시점에 사용할 수 있습니다. 그 값은 `NPM_TOKEN` 환경 변수에서 가져옵니다.

```yaml
services:
  myapp:
    build:
      secrets:
        - npm_token
      context: .

secrets:
  npm_token:
    environment: NPM_TOKEN
```

## 리소스 {#resources}

- [Secrets 최상위 요소](/reference/compose-file/secrets.md)
- [서비스 최상위 요소의 Secrets 속성](/reference/compose-file/services.md#secrets)
- [빌드 비밀](https://docs.docker.com/build/building/secrets/)
