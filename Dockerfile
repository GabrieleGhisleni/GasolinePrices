FROM python:3.10-slim

COPY poetry.lock pyproject.toml /home/src/
ENV PATH=/root/.local/bin:$PATH

RUN apt-get update -qq && \
    apt-get install -qq -y build-essential libffi-dev libssl-dev curl \
    gcc musl-dev python3-dev libffi-dev libssl-dev cargo && \
    curl -sSL https://install.python-poetry.org | python


RUN cd /home/src/ && \
    $HOME/.local/bin/poetry config virtualenvs.create false && \
    $HOME/.local/bin/poetry install --no-root && \
    apt-get -y -qq purge build-essential pkg-config && \
    apt-get -y -qq autoremove && \
    apt-get clean -qq && \
    rm -rf /root/.cache && \
    rm -rf /var/lib/apt/lists

ENV PYTHONPATH "${PYTHONPATH}:/home"
COPY /src /home/src

RUN mkdir /home/src/data
COPY data/details/impianti.json /home/src/data
COPY data/municipalities.geojson /home/src/data
COPY data/static_stations/municipalities.csv.zip /home/src/data
RUN mkdir /home/src/data/prices_for_municipality

WORKDIR /home/src
