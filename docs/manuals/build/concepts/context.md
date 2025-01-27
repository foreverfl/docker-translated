---
title: 빌드 컨텍스트
weight: 30
description: Dockerfile에서 파일에 접근하기 위해 빌드 컨텍스트를 사용하는 방법을 배우세요
keywords:
  - 빌드
  - buildx
  - buildkit
  - 컨텍스트
  - git
  - tarball
  - stdin
aliases:
  - /build/building/context/
---

`docker build` 및 `docker buildx build` 명령어는 [Dockerfile](/reference/dockerfile.md)과 컨텍스트에서 Docker 이미지를 빌드합니다.

## 빌드 컨텍스트란 무엇인가? {#what-is-a-build-context}

빌드 컨텍스트는 빌드가 접근할 수 있는 파일들의 집합입니다.
빌드 명령어에 전달하는 위치 인수가 사용하고자 하는 컨텍스트를 지정합니다:

```console
$ docker build [OPTIONS] PATH | URL | -
                         ^^^^^^^^^^^^^^
```

다음 입력 중 하나를 빌드 컨텍스트로 전달할 수 있습니다:

- 로컬 디렉토리의 상대 경로 또는 절대 경로
- Git 저장소, tarball 또는 일반 텍스트 파일의 원격 URL
- 표준 입력을 통해 `docker build` 명령어에 파이프된 일반 텍스트 파일 또는 tarball

### 파일 시스템 컨텍스트 {#filesystem-contexts}

빌드 컨텍스트가 로컬 디렉토리, 원격 Git 저장소 또는 tar 파일인 경우, 이는 빌더가 빌드 중에 접근할 수 있는 파일 집합이 됩니다. `COPY` 및 `ADD`와 같은 빌드 명령어는 컨텍스트의 파일 및 디렉토리를 참조할 수 있습니다.

파일 시스템 빌드 컨텍스트는 재귀적으로 처리됩니다:

- 로컬 디렉토리 또는 tarball을 지정하면 모든 하위 디렉토리가 포함됩니다.
- 원격 Git 저장소를 지정하면 저장소와 모든 서브모듈이 포함됩니다.

빌드에 사용할 수 있는 다양한 파일 시스템 컨텍스트에 대한 자세한 내용은 다음을 참조하세요:

- [로컬 파일](#local-context)
- [Git 저장소](#git-repositories)
- [원격 tarball](#remote-tarballs)

### 텍스트 파일 컨텍스트 {#text-file-contexts}

빌드 컨텍스트가 일반 텍스트 파일인 경우, 빌더는 파일을 Dockerfile로 해석합니다. 이 접근 방식에서는 파일 시스템 컨텍스트를 사용하지 않습니다.

자세한 내용은 [빈 빌드 컨텍스트](#empty-context)를 참조하세요.

## 로컬 컨텍스트 {#local-context}

로컬 빌드 컨텍스트를 사용하려면 `docker build` 명령어에 상대 경로 또는 절대 파일 경로를 지정할 수 있습니다. 다음 예제는 현재 디렉토리(`.`)를 빌드 컨텍스트로 사용하는 빌드 명령어를 보여줍니다:

```console
$ docker build .
...
#16 [internal] load build context
#16 sha256:23ca2f94460dcbaf5b3c3edbaaa933281a4e0ea3d92fe295193e4df44dc68f85
#16 transferring context: 13.16MB 2.2s done
...
```

이렇게 하면 현재 작업 디렉토리의 파일 및 디렉토리가 빌더에게 제공됩니다. 빌더는 필요한 파일을 빌드 컨텍스트에서 로드합니다.

로컬 tarball을 빌드 컨텍스트로 사용하려면 tarball 내용을 `docker build` 명령어에 파이프할 수 있습니다. [Tarballs](#local-tarballs)를 참조하세요.

### 로컬 디렉토리 {#local-directories}

다음 디렉토리 구조를 고려해보세요:

```text
.
├── index.ts
├── src/
├── Dockerfile
├── package.json
└── package-lock.json
```

Dockerfile 명령어는 이 디렉토리를 컨텍스트로 전달하면 이러한 파일을 참조하고 포함할 수 있습니다.

```dockerfile
# syntax=docker/dockerfile:1
FROM node:latest
WORKDIR /src
COPY package.json package-lock.json .
RUN npm ci
COPY index.ts src .
```

```console
$ docker build .
```

### stdin에서 Dockerfile을 사용하는 로컬 컨텍스트 {#local-context-with-dockerfile-from-stdin}

로컬 파일 시스템의 파일을 사용하면서 stdin에서 Dockerfile을 사용하는 이미지를 빌드하려면 다음 구문을 사용하세요.

```console
$ docker build -f- <PATH>
```

이 구문은 -f (또는 --file) 옵션을 사용하여 사용할 Dockerfile을 지정하고, 하이픈(-)을 파일 이름으로 사용하여 Docker가 stdin에서 Dockerfile을 읽도록 지시합니다.

다음 예제는 현재 디렉토리(.)를 빌드 컨텍스트로 사용하고, here-document를 사용하여 stdin을 통해 전달된 Dockerfile을 사용하여 이미지를 빌드합니다.

```bash
# 작업할 디렉토리 생성
mkdir example
cd example

# 예제 파일 생성
touch somefile.txt

# 현재 디렉토리를 컨텍스트로 사용하여 이미지를 빌드하고
# stdin을 통해 전달된 Dockerfile을 사용
docker build -t myimage:latest -f- . <<EOF
FROM busybox
COPY somefile.txt ./
RUN cat /somefile.txt
EOF
```

### 로컬 tarball {#local-tarballs}

tarball을 빌드 명령어에 파이프할 때, 빌드는 tarball의 내용을 파일 시스템 컨텍스트로 사용합니다.

예를 들어, 다음 프로젝트 디렉토리가 있다고 가정합니다:

```text
.
├── Dockerfile
├── Makefile
├── README.md
├── main.c
├── scripts
├── src
└── test.Dockerfile
```

디렉토리의 tarball을 생성하고 이를 빌드에 파이프하여 컨텍스트로 사용할 수 있습니다:

```console
$ tar czf foo.tar.gz *
$ docker build - < foo.tar.gz
```

빌드는 tarball 컨텍스트에서 Dockerfile을 해결합니다. `--file` 플래그를 사용하여 tarball의 루트 상대 위치에 있는 Dockerfile의 이름과 위치를 지정할 수 있습니다. 다음 명령어는 tarball의 `test.Dockerfile`을 사용하여 빌드합니다:

```console
$ docker build --file test.Dockerfile - < foo.tar.gz
```

## 원격 컨텍스트 {#remote-context}

원격 Git 저장소, tarball 또는 일반 텍스트 파일의 주소를 빌드 컨텍스트로 지정할 수 있습니다.

- Git 저장소의 경우, 빌더가 자동으로 저장소를 클론합니다. [Git 저장소](#git-repositories)를 참조하세요.
- tarball의 경우, 빌더가 tarball의 내용을 다운로드하고 추출합니다. [Tarballs](#remote-tarballs)를 참조하세요.

원격 tarball이 텍스트 파일인 경우, 빌더는 [파일 시스템 컨텍스트](#filesystem-contexts)를 받지 않고, 대신 원격 파일을 Dockerfile로 간주합니다. [빈 빌드 컨텍스트](#empty-context)를 참조하세요.

### Git 저장소 {#git-repositories}

`docker build`에 Git 저장소의 위치를 가리키는 URL을 인수로 전달하면, 빌더는 저장소를 빌드 컨텍스트로 사용합니다.

빌더는 저장소의 HEAD 커밋만 다운로드하는 얕은 클론을 수행합니다.

빌더는 저장소와 포함된 모든 서브모듈을 재귀적으로 클론합니다.

```console
$ docker build https://github.com/user/myrepo.git
```

기본적으로 빌더는 지정한 저장소의 기본 브랜치의 최신 커밋을 클론합니다.

#### URL 프래그먼트 {#url-fragments}

URL 프래그먼트를 Git 저장소 주소에 추가하여 빌더가 특정 브랜치, 태그 및 저장소의 하위 디렉토리를 클론하도록 할 수 있습니다.

URL 프래그먼트의 형식은 `#ref:dir`이며, 여기서:

- `ref`는 브랜치, 태그 또는 커밋 해시의 이름입니다.
- `dir`은 저장소 내의 하위 디렉토리입니다.

예를 들어, 다음 명령어는 `container` 브랜치와 해당 브랜치의 `docker` 하위 디렉토리를 빌드 컨텍스트로 사용합니다:

```console
$ docker build https://github.com/user/myrepo.git#container:docker
```

다음 표는 빌드 컨텍스트와 함께 사용되는 모든 유효한 접미사를 나타냅니다:

| 빌드 구문 접미사                | 사용된 커밋                   | 사용된 빌드 컨텍스트 |
| ------------------------------ | ----------------------------- | ------------------ |
| `myrepo.git`                   | `refs/heads/<default branch>` | `/`                |
| `myrepo.git#mytag`             | `refs/tags/mytag`             | `/`                |
| `myrepo.git#mybranch`          | `refs/heads/mybranch`         | `/`                |
| `myrepo.git#pull/42/head`      | `refs/pull/42/head`           | `/`                |
| `myrepo.git#:myfolder`         | `refs/heads/<default branch>` | `/myfolder`        |
| `myrepo.git#master:myfolder`   | `refs/heads/master`           | `/myfolder`        |
| `myrepo.git#mytag:myfolder`    | `refs/tags/mytag`             | `/myfolder`        |
| `myrepo.git#mybranch:myfolder` | `refs/heads/mybranch`         | `/myfolder`        |

URL 프래그먼트에서 `ref`로 커밋 해시를 사용할 때는 전체 40자 문자열 SHA-1 해시를 사용하세요. 예를 들어, 7자로 잘린 짧은 해시는 지원되지 않습니다.

```bash
# ✅ 다음은 작동합니다:
docker build github.com/docker/buildx#d4f088e689b41353d74f1a0bfcd6d7c0b213aed2
# ❌ 다음은 커밋 해시가 잘려서 작동하지 않습니다:
docker build github.com/docker/buildx#d4f088e
```

#### `.git` 디렉토리 유지 {#keep-git-directory}

기본적으로 BuildKit은 Git 컨텍스트를 사용할 때 `.git` 디렉토리를 유지하지 않습니다.
빌드 중에 Git 정보를 검색하려는 경우, [`BUILDKIT_CONTEXT_KEEP_GIT_DIR` 빌드 인수](/reference/dockerfile.md#buildkit-built-in-build-args)를 설정하여 BuildKit이 디렉토리를 유지하도록 구성할 수 있습니다.

```dockerfile
# syntax=docker/dockerfile:1
FROM alpine
WORKDIR /src
RUN --mount=target=. \
  make REVISION=$(git rev-parse HEAD) build
```

```console
$ docker build \
  --build-arg BUILDKIT_CONTEXT_KEEP_GIT_DIR=1
  https://github.com/user/myrepo.git#main
```

#### 비공개 저장소 {#private-repositories}

Git 컨텍스트가 비공개 저장소인 경우, 빌더는 필요한 인증 자격 증명을 제공해야 합니다. SSH 또는 토큰 기반 인증을 사용할 수 있습니다.

Git 컨텍스트가 SSH 또는 Git 주소인 경우, Buildx는 SSH 자격 증명을 자동으로 감지하고 사용합니다. 기본적으로 `$SSH_AUTH_SOCK`을 사용합니다.
[`--ssh` 플래그](/reference/cli/docker/buildx/build.md#ssh)를 사용하여 사용할 SSH 자격 증명을 구성할 수 있습니다.

```console
$ docker buildx build --ssh default git@github.com:user/private.git
```

토큰 기반 인증을 사용하려면
[`--secret` 플래그](/reference/cli/docker/buildx/build.md#secret)를 사용하여 토큰을 전달할 수 있습니다.

```console
$ GIT_AUTH_TOKEN=<token> docker buildx build \
  --secret id=GIT_AUTH_TOKEN \
  https://github.com/user/private.git
```

> [!NOTE]
>
> 비밀 정보에 `--build-arg`를 사용하지 마세요.

### stdin에서 Dockerfile을 사용하는 원격 컨텍스트 {#remote-context-with-dockerfile-from-stdin}

로컬 파일 시스템의 파일을 사용하면서 stdin에서 Dockerfile을 사용하는 이미지를 빌드하려면 다음 구문을 사용하세요.

```console
$ docker build -f- <URL>
```

이 구문은 -f (또는 --file) 옵션을 사용하여 사용할 Dockerfile을 지정하고, 하이픈(-)을 파일 이름으로 사용하여 Docker가 stdin에서 Dockerfile을 읽도록 지시합니다.

이 방법은 Dockerfile을 포함하지 않는 저장소에서 이미지를 빌드하거나, 저장소의 포크를 유지하지 않고 사용자 정의 Dockerfile로 빌드하려는 경우에 유용합니다.

다음 예제는 stdin에서 Dockerfile을 사용하여 이미지를 빌드하고, GitHub의 [hello-world](https://github.com/docker-library/hello-world) 저장소에서 `hello.c` 파일을 추가합니다.

```bash
docker build -t myimage:latest -f- https://github.com/docker-library/hello-world.git <<EOF
FROM busybox
COPY hello.c ./
EOF
```

### 원격 tarball {#remote-tarballs}

원격 tarball의 URL을 전달하면, URL 자체가 빌더로 전송됩니다.

```console
$ docker build http://server/context.tar.gz
#1 [internal] load remote build context
#1 DONE 0.2s

#2 copy /context /
#2 DONE 0.1s
...
```

다운로드 작업은 BuildKit 데몬이 실행 중인 호스트에서 수행됩니다. 원격 Docker 컨텍스트 또는 원격 빌더를 사용하는 경우, 이는 빌드 명령어를 실행하는 머신과 반드시 동일한 머신이 아닙니다. BuildKit은 `context.tar.gz`를 가져와 빌드 컨텍스트로 사용합니다. tarball 컨텍스트는 표준 `tar` Unix 형식을 준수하는 tar 아카이브여야 하며, `xz`, `bzip2`, `gzip` 또는 `identity` (압축 없음) 형식으로 압축될 수 있습니다.

## 빈 컨텍스트 {#empty-context}

빌드 컨텍스트로 텍스트 파일을 사용할 때, 빌더는 파일을 Dockerfile로 해석합니다. 텍스트 파일을 컨텍스트로 사용하면 빌드에 파일 시스템 컨텍스트가 없습니다.

Dockerfile이 로컬 파일에 의존하지 않는 경우 빈 빌드 컨텍스트로 빌드할 수 있습니다.

### 컨텍스트 없이 빌드하는 방법 {#how-to-build-without-a-context}

표준 입력 스트림을 사용하거나 원격 텍스트 파일의 URL을 지정하여 텍스트 파일을 전달할 수 있습니다.

<Tabs>
<TabItem value="unix-pipe" label="Unix 파이프">

```console
$ docker build - < Dockerfile
```

</TabItem>
<TabItem value="powershell" label="PowerShell">

```powershell
Get-Content Dockerfile | docker build -
```

</TabItem>
<TabItem value="heredocs" label="Heredocs">

```bash
docker build -t myimage:latest - <<EOF
FROM busybox
RUN echo "hello world"
EOF
```

</TabItem>
<TabItem value="remote-file" label="원격 파일">

```console
$ docker build https://raw.githubusercontent.com/dvdksn/clockbox/main/Dockerfile
```

</TabItem>
</Tabs>

파일 시스템 컨텍스트 없이 빌드할 때, Dockerfile 명령어인 `COPY`는 로컬 파일을 참조할 수 없습니다:

```console
$ ls
main.c
$ docker build -<<< $'FROM scratch\nCOPY main.c .'
[+] Building 0.0s (4/4) FINISHED
 => [internal] load build definition from Dockerfile       0.0s
 => => transferring dockerfile: 64B                        0.0s
 => [internal] load .dockerignore                          0.0s
 => => transferring context: 2B                            0.0s
 => [internal] load build context                          0.0s
 => => transferring context: 2B                            0.0s
 => ERROR [1/1] COPY main.c .                              0.0s
------
 > [1/1] COPY main.c .:
------
Dockerfile:2
--------------------
   1 |     FROM scratch
   2 | >>> COPY main.c .
   3 |
--------------------
ERROR: failed to solve: failed to compute cache key: failed to calculate checksum of ref 7ab2bb61-0c28-432e-abf5-a4c3440bc6b6::4lgfpdf54n5uqxnv9v6ymg7ih: "/main.c": not found
```

## .dockerignore 파일 {#dockerignore-files}

`.dockerignore` 파일을 사용하여 빌드 컨텍스트에서 파일이나 디렉토리를 제외할 수 있습니다.

```text
# .dockerignore
node_modules
bar
```

이렇게 하면 원하지 않는 파일과 디렉토리를 빌더로 보내는 것을 방지하여 빌드 속도를 향상시킬 수 있습니다. 특히 원격 빌더를 사용할 때 유용합니다.

### 파일 이름 및 위치 {#filename-and-location}

빌드 명령어를 실행할 때, 빌드 클라이언트는 컨텍스트의 루트 디렉토리에 `.dockerignore`라는 파일이 있는지 확인합니다. 이 파일이 존재하면, 파일에 있는 패턴과 일치하는 파일 및 디렉토리가 빌더로 보내지기 전에 빌드 컨텍스트에서 제거됩니다.

여러 Dockerfile을 사용하는 경우, 각 Dockerfile에 대해 다른 ignore 파일을 사용할 수 있습니다. 이를 위해 ignore 파일의 이름을 특별한 방식으로 지정합니다. ignore 파일을 Dockerfile과 동일한 디렉토리에 배치하고, ignore 파일의 이름을 Dockerfile의 이름으로 접두사로 지정합니다. 다음 예제를 참조하세요.

```text
.
├── index.ts
├── src/
├── docker
│   ├── build.Dockerfile
│   ├── build.Dockerfile.dockerignore
│   ├── lint.Dockerfile
│   ├── lint.Dockerfile.dockerignore
│   ├── test.Dockerfile
│   └── test.Dockerfile.dockerignore
├── package.json
└── package-lock.json
```

Dockerfile 전용 ignore 파일은 둘 다 존재하는 경우 루트 빌드 컨텍스트의 `.dockerignore` 파일보다 우선합니다.

### 구문

`.dockerignore` 파일은 Unix 셸의 파일 글로브와 유사한 패턴의 개행으로 구분된 목록입니다. ignore 패턴의 선행 및 후행 슬래시는 무시됩니다. 다음 패턴은 모두 빌드 컨텍스트의 루트 하위 디렉토리 `foo`에 있는 `bar`라는 파일 또는 디렉토리를 제외합니다:

- `/foo/bar/`
- `/foo/bar`
- `foo/bar/`
- `foo/bar`

`.dockerignore` 파일의 줄이 1열에서 `#`로 시작하면, 이 줄은 주석으로 간주되어 CLI에서 해석되기 전에 무시됩니다.

```gitignore
#/this/is/a/comment
```

`.dockerignore` 패턴 매칭 로직의 정확한 세부 사항을 알고 싶다면, GitHub의 [moby/patternmatcher 리포지토리](https://github.com/moby/patternmatcher/tree/main/ignorefile)를 확인하세요. 여기에는 소스 코드가 포함되어 있습니다.

#### 매칭

다음 코드 스니펫은 예제 `.dockerignore` 파일을 보여줍니다.

```text
# comment
*/temp*
*/*/temp*
temp?
```

이 파일은 다음과 같은 빌드 동작을 유발합니다:

| 규칙        | 동작                                                                                                                                                                                                      |
| :---------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `# comment` | 무시됨.                                                                                                                                                                                                      |
| `*/temp*`   | 루트의 모든 하위 디렉토리에서 이름이 `temp`로 시작하는 파일 및 디렉토리를 제외합니다. 예를 들어, 일반 파일 `/somedir/temporary.txt`는 제외되며, 디렉토리 `/somedir/temp`도 제외됩니다. |
| `*/*/temp*` | 루트에서 두 레벨 아래의 하위 디렉토리에서 `temp`로 시작하는 파일 및 디렉토리를 제외합니다. 예를 들어, `/somedir/subdir/temporary.txt`는 제외됩니다.                                         |
| `temp?`     | 루트 디렉토리에서 이름이 `temp`의 한 문자 확장인 파일 및 디렉토리를 제외합니다. 예를 들어, `/tempa` 및 `/tempb`는 제외됩니다.                                                     |

매칭은 Go의 [`filepath.Match` 함수](https://golang.org/pkg/path/filepath#Match) 규칙을 사용하여 수행됩니다. 전처리 단계에서는 Go의 [`filepath.Clean` 함수](https://golang.org/pkg/path/filepath/#Clean)를 사용하여 공백을 제거하고 `.` 및 `..`을 제거합니다. 전처리 후 빈 줄은 무시됩니다.

> [!NOTE]
>
> 역사적인 이유로, 패턴 `.`은 무시됩니다.

Go의 `filepath.Match` 규칙 외에도 Docker는 디렉토리 수(0 포함)에 관계없이 일치하는 특수 와일드카드 문자열 `**`를 지원합니다. 예를 들어, `**/*.go`는 빌드 컨텍스트 어디에서나 `.go`로 끝나는 모든 파일을 제외합니다.

`.dockerignore` 파일을 사용하여 `Dockerfile` 및 `.dockerignore` 파일을 제외할 수 있습니다. 이러한 파일은 빌드를 실행하는 데 필요하므로 여전히 빌더로 전송됩니다. 그러나 `ADD`, `COPY` 또는 바인드 마운트를 사용하여 파일을 이미지에 복사할 수는 없습니다.

#### 매칭 부정

제외에 대한 예외를 만들기 위해 줄 앞에 `!`(느낌표)를 추가할 수 있습니다. 다음은 이 메커니즘을 사용하는 예제 `.dockerignore` 파일입니다:

```text
*.md
!README.md
```

컨텍스트 디렉토리 바로 아래의 모든 마크다운 파일 중 `README.md`를 제외한 모든 파일이 컨텍스트에서 제외됩니다. 하위 디렉토리의 마크다운 파일은 여전히 포함됩니다.

`!` 예외 규칙의 위치는 동작에 영향을 미칩니다: 특정 파일과 일치하는 `.dockerignore`의 마지막 줄이 포함 여부를 결정합니다. 다음 예제를 고려해보세요:

```text
*.md
!README*.md
README-secret.md
```

컨텍스트에는 `README-secret.md`를 제외한 모든 README 파일이 포함됩니다.

이제 이 예제를 고려해보세요:

```text
*.md
README-secret.md
!README*.md
```

모든 README 파일이 포함됩니다. 중간 줄은 `!README*.md`가 `README-secret.md`와 일치하고 마지막에 오기 때문에 아무런 효과가 없습니다.
