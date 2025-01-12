---
title: 바인드 마운트 사용
weight: 60
linkTitle: "Part 5: Use bind mounts"
keywords:
  - 시작하기
  - 설정
  - 오리엔테이션
  - 빠른 시작
  - 소개
  - 개념
  - 컨테이너
  - 도커 데스크탑
description: 애플리케이션에서 바인드 마운트 사용
aliases:
  - /guides/walkthroughs/access-local-folder/
  - /get-started/06_bind_mounts/
  - /guides/workshop/06_bind_mounts/
---

[파트 4](./05_persisting_data.md)에서는 데이터베이스의 데이터를 지속시키기 위해 볼륨 마운트를 사용했습니다. 볼륨 마운트는 애플리케이션 데이터를 저장할 영구적인 장소가 필요할 때 좋은 선택입니다.

바인드 마운트는 또 다른 유형의 마운트로, 호스트 파일 시스템의 디렉토리를 컨테이너와 공유할 수 있게 해줍니다. 애플리케이션 작업 시, 바인드 마운트를 사용하여 소스 코드를 컨테이너에 마운트할 수 있습니다. 파일을 저장하자마자 코드 변경 사항이 컨테이너에 즉시 반영됩니다. 이는 파일 시스템 변경을 감지하고 이에 반응하는 프로세스를 컨테이너에서 실행할 수 있음을 의미합니다.

이 장에서는 바인드 마운트와 [nodemon](https://npmjs.com/package/nodemon)이라는 도구를 사용하여 파일 변경을 감지하고 애플리케이션을 자동으로 재시작하는 방법을 살펴보겠습니다. 대부분의 다른 언어와 프레임워크에서도 유사한 도구가 있습니다.

## 볼륨 유형 간의 빠른 비교 {#quick-volume-type-comparisons}

다음은 `--mount`를 사용한 명명된 볼륨과 바인드 마운트의 예입니다:

- 명명된 볼륨: `type=volume,src=my-volume,target=/usr/local/data`
- 바인드 마운트: `type=bind,src=/path/to/data,target=/usr/local/data`

다음 표는 볼륨 마운트와 바인드 마운트 간의 주요 차이점을 요약한 것입니다.

|                                  | 명명된 볼륨   | 바인드 마운트 |
| -------------------------------- | ------------- | ------------- |
| 호스트 위치                      | Docker가 선택 | 사용자가 결정 |
| 새 볼륨을 컨테이너 내용으로 채움 | 예            | 아니요        |
| 볼륨 드라이버 지원               | 예            | 아니요        |

## 바인드 마운트 시도하기 {#trying-out-bind-mounts}

애플리케이션 개발에 바인드 마운트를 사용하는 방법을 살펴보기 전에, 바인드 마운트가 어떻게 작동하는지 실습을 통해 이해해보겠습니다.

1. `getting-started-app` 디렉토리가 Docker Desktop의 파일 공유 설정에 정의된 디렉토리에 있는지 확인합니다. 이 설정은 컨테이너와 공유할 수 있는 파일 시스템의 부분을 정의합니다. 설정에 액세스하는 방법에 대한 자세한 내용은 [파일 공유](/manuals/desktop/settings-and-maintenance/settings.md#file-sharing)를 참조하세요.

2. 터미널을 열고 `getting-started-app` 디렉토리로 이동합니다.

3. 바인드 마운트와 함께 `ubuntu` 컨테이너에서 `bash`를 시작하려면 다음 명령을 실행합니다.

  <Tabs>
    <TabItem value="mac-linux" label="Mac / Linux">
      ```bash
      docker run -it --mount type=bind,src="$(pwd)",target=/src ubuntu bash
      ```
    </TabItem>

    <TabItem value="command-prompt" label="Command Prompt">
      ```bash
      docker run -it --mount "type=bind,src=%cd%,target=/src" ubuntu bash
      ```
    </TabItem>

    <TabItem value="git-bash" label="Git Bash">
      ```bash
      docker run -it --mount type=bind,src="/$(pwd)",target=/src ubuntu bash
      ```
    </TabItem>

    <TabItem value="powershell" label="PowerShell">
      ```bash
      docker run -it --mount "type=bind,src=$($pwd),target=/src" ubuntu bash
      ```
    </TabItem>

  </Tabs>

`--mount type=bind` 옵션은 Docker에게 바인드 마운트를 생성하도록 지시합니다. 여기서 `src`는 호스트 머신의 현재 작업 디렉토리(`getting-started-app`), `target`은 해당 디렉토리가 컨테이너 내에서 나타나야 하는 위치(`/src`)입니다.

4. 명령을 실행한 후, Docker는 컨테이너 파일 시스템의 루트 디렉토리에서 대화형 `bash` 세션을 시작합니다.

   ```bash
   root@ac1237fad8db:/# pwd
   /
   root@ac1237fad8db:/# ls
   bin   dev  home  media  opt   root  sbin  srv  tmp  var
   boot  etc  lib   mnt    proc  run   src   sys  usr
   ```

5. `src` 디렉토리로 이동합니다.

   이 디렉토리는 컨테이너를 시작할 때 마운트한 디렉토리입니다. 이 디렉토리의 내용을 나열하면 호스트 머신의 `getting-started-app` 디렉토리와 동일한 파일이 표시됩니다.

   ```bash
   root@ac1237fad8db:/# cd src
   root@ac1237fad8db:/src# ls
   Dockerfile  node_modules  package.json  spec  src  yarn.lock
   ```

6. `myfile.txt`라는 새 파일을 만듭니다.

   ```bash
   root@ac1237fad8db:/src# touch myfile.txt
   root@ac1237fad8db:/src# ls
   Dockerfile  myfile.txt  node_modules  package.json  spec  src  yarn.lock
   ```

7. 호스트에서 `getting-started-app` 디렉토리를 열고 `myfile.txt` 파일이 디렉토리에 있는지 확인합니다.

   ```text
   ├── getting-started-app/
   │ ├── Dockerfile
   │ ├── myfile.txt
   │ ├── node_modules/
   │ ├── package.json
   │ ├── spec/
   │ ├── src/
   │ └── yarn.lock
   ```

8. 호스트에서 `myfile.txt` 파일을 삭제합니다.
9. 컨테이너에서 `app` 디렉토리의 내용을 다시 나열합니다. 파일이 사라진 것을 확인합니다.

   ```bash
   root@ac1237fad8db:/src# ls
   Dockerfile  node_modules  package.json  spec  src  yarn.lock
   ```

10. `Ctrl` + `D`를 사용하여 대화형 컨테이너 세션을 중지합니다.

이것으로 바인드 마운트에 대한 간단한 소개가 끝났습니다. 이 절차는 파일이 호스트와 컨테이너 간에 어떻게 공유되는지, 그리고 변경 사항이 양쪽에 즉시 반영되는지 보여주었습니다. 이제 바인드 마운트를 사용하여 소프트웨어를 개발할 수 있습니다.

## 개발 컨테이너 {#development-containers}

바인드 마운트를 사용하는 것은 로컬 개발 환경에서 일반적입니다. 장점은 개발 머신에 모든 빌드 도구와 환경을 설치할 필요가 없다는 것입니다. 단일 docker run 명령으로 Docker는 종속성과 도구를 가져옵니다.

### 개발 컨테이너에서 애플리케이션 실행 {#run-your-app-in-a-development-container}

다음 단계는 바인드 마운트를 사용하여 개발 컨테이너를 실행하는 방법을 설명합니다:

- 소스 코드를 컨테이너에 마운트
- 모든 종속성 설치
- 파일 시스템 변경을 감지하기 위해 `nodemon` 시작

CLI 또는 Docker Desktop을 사용하여 바인드 마운트로 컨테이너를 실행할 수 있습니다.

<Tabs>
  <TabItem value="mac-linux" label="Mac / Linux CLI">
    1. 현재 실행 중인 `getting-started` 컨테이너가 없는지 확인합니다.

    2. `getting-started-app` 디렉토리에서 다음 명령을 실행합니다.

       ```bash
       docker run -dp 127.0.0.1:3000:3000 \
           -w /app --mount type=bind,src="$(pwd)",target=/app \
           node:18-alpine \
           sh -c "yarn install && yarn run dev"
       ```

    다음은 명령의 세부 사항입니다:

    - `-dp 127.0.0.1:3000:3000` - 분리 모드로 실행하고 포트 매핑을 생성합니다.
    - `-w /app` - 컨테이너에서 "작업 디렉토리"를 설정합니다.
    - `--mount type=bind,src="$(pwd)",target=/app` - 현재 디렉토리를 컨테이너의 `/app`에 바인드 마운트합니다.
    - `node:18-alpine` - 사용할 이미지입니다.
    - `sh -c "yarn install && yarn run dev"` - 개발 서버를 시작합니다.

    3. `docker logs <container-id>`를 사용하여 로그를 확인할 수 있습니다:

       ```bash
       docker logs -f <container-id>
       ```

       다음과 같은 메시지가 표시되면 준비가 완료된 것입니다:

       ```plaintext
       nodemon -L src/index.js
       [nodemon] 2.0.20
       [nodemon] to restart at any time, enter `rs`
       [nodemon] watching path(s): *.*
       [nodemon] watching extensions: js,mjs,json
       [nodemon] starting `node src/index.js`
       Using sqlite database at /etc/todos/todo.db
       Listening on port 3000
       ```

       `Ctrl`+`C`를 눌러 로그를 종료합니다.

  </TabItem>

  <TabItem value="powershell" label="PowerShell CLI">
    1. 현재 실행 중인 `getting-started` 컨테이너가 없는지 확인합니다.

    2. `getting-started-app` 디렉토리에서 다음 명령을 실행합니다.

       ```powershell
       docker run -dp 127.0.0.1:3000:3000 `
           -w /app --mount "type=bind,src=$pwd,target=/app" `
           node:18-alpine `
           sh -c "yarn install && yarn run dev"
       ```

    명령의 세부 사항은 "Mac / Linux CLI" 탭과 동일합니다.

    3. `docker logs <container-id>`를 사용하여 로그를 확인할 수 있습니다:

       ```bash
       docker logs -f <container-id>
       ```

       "Mac / Linux CLI" 탭과 동일한 출력이 표시되면 준비가 완료된 것입니다.

  </TabItem>

  <TabItem value="command-prompt" label="Command Prompt CLI">
    1. 현재 실행 중인 `getting-started` 컨테이너가 없는지 확인합니다.

    2. `getting-started-app` 디렉토리에서 다음 명령을 실행합니다.

       ```cmd
       docker run -dp 127.0.0.1:3000:3000 ^
           -w /app --mount "type=bind,src=%cd%,target=/app" ^
           node:18-alpine ^
           sh -c "yarn install && yarn run dev"
       ```

    명령의 세부 사항은 "Mac / Linux CLI" 탭과 동일합니다.

    3. `docker logs <container-id>`를 사용하여 로그를 확인할 수 있습니다:

       ```bash
       docker logs -f <container-id>
       ```

       "Mac / Linux CLI" 탭과 동일한 출력이 표시되면 준비가 완료된 것입니다.

  </TabItem>

  <TabItem value="git-bash" label="Git Bash CLI">
    1. 현재 실행 중인 `getting-started` 컨테이너가 없는지 확인합니다.

    2. `getting-started-app` 디렉토리에서 다음 명령을 실행합니다.

       ```bash
       docker run -dp 127.0.0.1:3000:3000 \
           -w //app --mount type=bind,src="/$(pwd)",target=/app \
           node:18-alpine \
           sh -c "yarn install && yarn run dev"
       ```

    명령의 세부 사항은 "Mac / Linux CLI" 탭과 동일합니다.

    3. `docker logs <container-id>`를 사용하여 로그를 확인할 수 있습니다:

       ```bash
       docker logs -f <container-id>
       ```

       "Mac / Linux CLI" 탭과 동일한 출력이 표시되면 준비가 완료된 것입니다.

  </TabItem>

  <TabItem value="docker-desktop" label="Docker Desktop">
    1. 현재 실행 중인 `getting-started` 컨테이너가 없는지 확인합니다.

    2. 바인드 마운트로 이미지를 실행합니다:

       - Docker Desktop 상단의 검색 상자를 선택합니다.
       - 검색 창에서 **이미지** 탭을 선택합니다.
       - 검색 상자에 컨테이너 이름 `getting-started`를 입력합니다.
       - 이미지를 선택한 다음 **실행**을 선택합니다.
       - **선택적 설정**을 선택합니다.
       - **호스트 경로**에 호스트 머신의 `getting-started-app` 디렉토리 경로를 지정합니다.
       - **컨테이너 경로**에 `/app`을 지정합니다.
       - **실행**을 선택합니다.

    3. Docker Desktop을 사용하여 컨테이너 로그를 확인할 수 있습니다:

       - Docker Desktop에서 **컨테이너**를 선택합니다.
       - 컨테이너 이름을 선택합니다.

       다음과 같은 메시지가 표시되면 준비가 완료된 것입니다:

       ```plaintext
       nodemon -L src/index.js
       [nodemon] 2.0.20
       [nodemon] to restart at any time, enter `rs`
       [nodemon] watching path(s): *.*
       [nodemon] watching extensions: js,mjs,json
       [nodemon] starting `node src/index.js`
       Using sqlite database at /etc/todos/todo.db
       Listening on port 3000
       ```

  </TabItem>
</Tabs>

### 개발 컨테이너로 애플리케이션 개발 {#develop-your-app-with-the-development-container}

호스트 머신에서 애플리케이션을 업데이트하고 컨테이너에서 변경 사항이 반영되는지 확인합니다.

1. `src/static/js/app.js` 파일의 109번째 줄에서 "Add Item" 버튼을 "Add"로 변경합니다:

   ```diff
   - {submitting ? 'Adding...' : 'Add Item'}
   + {submitting ? 'Adding...' : 'Add'}
   ```

   파일을 저장합니다.

2. 웹 브라우저에서 페이지를 새로 고치면 바인드 마운트 덕분에 변경 사항이 거의 즉시 반영되는 것을 볼 수 있습니다. Nodemon이 변경 사항을 감지하고 서버를 재시작합니다. Node 서버가 재시작되는 데 몇 초가 걸릴 수 있습니다. 오류가 발생하면 몇 초 후에 새로 고침을 시도해 보세요.

   ![업데이트된 Add 버튼 레이블의 스크린샷](images/updated-add-button.webp)

3. 원하는 다른 변경 사항을 자유롭게 수행하세요. 파일을 변경하고 저장할 때마다 바인드 마운트 덕분에 변경 사항이 컨테이너에 반영됩니다. Nodemon이 변경 사항을 감지하면 컨테이너 내부에서 앱을 자동으로 재시작합니다. 완료되면 컨테이너를 중지하고 다음 명령을 사용하여 새 이미지를 빌드하세요:

   ```bash
   $ docker build -t getting-started .
   ```

## 요약 {#summary}

이 시점에서 데이터베이스를 지속시키고 이미지를 다시 빌드하지 않고도 애플리케이션을 개발하면서 변경 사항을 확인할 수 있습니다.

볼륨 마운트와 바인드 마운트 외에도 Docker는 더 복잡하고 전문화된 사용 사례를 처리하기 위한 다른 마운트 유형과 스토리지 드라이버를 지원합니다.

관련 정보:

- [docker CLI 참조](/reference/cli/docker/)
- [Docker에서 데이터 관리](https://docs.docker.com/storage/)

## 다음 단계 {#next-steps}

애플리케이션을 프로덕션에 준비하려면 데이터베이스를 SQLite에서 더 확장 가능한 것으로 마이그레이션해야 합니다. 간단히 하기 위해 관계형 데이터베이스를 계속 사용하고 애플리케이션을 MySQL로 전환할 것입니다. 하지만 MySQL을 어떻게 실행해야 할까요? 컨테이너 간의 통신을 어떻게 허용할까요? 다음 섹션에서 이에 대해 배울 것입니다.

<Button href="07_multi_container.md">다중 컨테이너 애플리케이션</Button>
