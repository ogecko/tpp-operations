FROM abernix/meteord:node-8.4.0-base
RUN apt-get update
RUN apt-get install -y \
  xvfb \
  x11-xkb-utils \
  xfonts-100dpi \
  xfonts-75dpi \
  xfonts-scalable \
  xfonts-cyrillic \
  x11-apps \
  clang \
  libdbus-1-dev \
  libgtk2.0-dev \
  libnotify-dev \
  libgnome-keyring-dev \
  libgconf2-dev \
  libasound2-dev \
  libcap-dev \
  libcups2-dev \
  libxtst-dev \
  libxss1 \
  libnss3-dev \
  gcc-multilib \
  g++-multilib
RUN sed 's/node main.js/xvfb-run --server-args="-screen 0 1024x768x24" node main.js/' /opt/meteord/run_app.sh > /opt/meteord/run_appx.sh
RUN sed 's/Starting meteor app/Starting xvfb meteor app/' /opt/meteord/run_appx.sh > /opt/meteord/run_app.sh
RUN chmod +x /opt/meteord/run_app.sh
