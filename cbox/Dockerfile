FROM ubuntu:20.10

RUN apt-get update -y && apt-get install -y --no-install-recommends nodejs npm

WORKDIR /var/www/apps/cbox/scripts
RUN npm i

ARG BOX_UUID
RUN mkdir -p /var/www/configs/
RUN rm -f /var/www/configs/box_uuid
RUN touch /var/www/configs/box_uuid
RUN echo $BOX_UUID >> /var/www/configs/box_uuid

CMD node /var/www/apps/cbox/scripts/run.js
