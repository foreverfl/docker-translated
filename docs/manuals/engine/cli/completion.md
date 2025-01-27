---
title: 자동 완성
weight: 10
description: Docker 명령어 및 플래그에 대한 자동 완성을 위해 셸을 설정합니다
keywords:
  - cli
  - shell
  - fish
  - bash
  - zsh
  - completion
  - options
aliases:
  - /config/completion/
---

Docker CLI에 대한 셸 완성 스크립트를 `docker completion` 명령어를 사용하여 생성할 수 있습니다. 완성 스크립트는 터미널에 입력할 때 `<Tab>` 키를 누르면 명령어, 플래그 및 Docker 객체(예: 컨테이너 및 볼륨 이름)에 대한 단어 완성을 제공합니다.

다음 셸에 대한 완성 스크립트를 생성할 수 있습니다:

- [Bash](#bash)
- [Zsh](#zsh)
- [fish](#fish)

## Bash {#bash}

Bash에서 Docker CLI 완성을 사용하려면 먼저 셸 완성을 위한 여러 Bash 함수를 포함하는 `bash-completion` 패키지를 설치해야 합니다.

```bash
# APT를 사용하여 설치:
sudo apt install bash-completion

# Homebrew를 사용하여 설치 (Bash 버전 4 이상):
brew install bash-completion@2
# 이전 버전의 Bash에 대한 Homebrew 설치:
brew install bash-completion

# pacman을 사용하여 설치:
sudo pacman -S bash-completion
```

`bash-completion`을 설치한 후 셸 구성 파일(이 예에서는 `.bashrc`)에서 스크립트를 소스합니다.

```bash
# Linux에서:
cat <<EOT >> ~/.bashrc
if [ -f /etc/bash_completion ]; then
    . /etc/bash_completion
fi
EOT

# macOS / Homebrew에서:
cat <<EOT >> ~/.bash_profile
[[ -r "$(brew --prefix)/etc/profile.d/bash_completion.sh" ]] && . "$(brew --prefix)/etc/profile.d/bash_completion.sh"
EOT
```

그리고 셸 구성을 다시 로드합니다:

```bash
$ source ~/.bashrc
```

이제 `docker completion` 명령어를 사용하여 Bash 완성 스크립트를 생성할 수 있습니다:

```bash
$ mkdir -p ~/.local/share/bash-completion/completions
$ docker completion bash > ~/.local/share/bash-completion/completions/docker
```

## Zsh {#zsh}

Zsh [완성 시스템](http://zsh.sourceforge.net/Doc/Release/Completion-System.html)은 `FPATH`를 사용하여 완성을 소스할 수 있는 한 모든 것을 처리합니다.

Oh My Zsh를 사용하는 경우 `~/.zshrc`를 수정하지 않고 `~/.oh-my-zsh/completions` 디렉토리에 완성 스크립트를 저장할 수 있습니다.

```bash
$ mkdir -p ~/.oh-my-zsh/completions
$ docker completion zsh > ~/.oh-my-zsh/completions/_docker
```

Oh My Zsh를 사용하지 않는 경우, 선택한 디렉토리에 완성 스크립트를 저장하고 `.zshrc`에서 `FPATH`에 디렉토리를 추가합니다.

```bash
$ mkdir -p ~/.docker/completions
$ docker completion zsh > ~/.docker/completions/_docker
```

```bash
$ cat <<"EOT" >> ~/.zshrc
FPATH="$HOME/.docker/completions:$FPATH"
autoload -Uz compinit
compinit
EOT
```

## Fish {#fish}

fish 셸은 [완성 시스템](https://fishshell.com/docs/current/#tab-completion)을 기본적으로 지원합니다.
Docker 명령어에 대한 완성을 활성화하려면 완성 스크립트를 fish 셸 `completions/` 디렉토리에 복사하거나 심볼릭 링크를 만듭니다:

```bash
$ mkdir -p ~/.config/fish/completions
$ docker completion fish > ~/.config/fish/completions/docker.fish
```
