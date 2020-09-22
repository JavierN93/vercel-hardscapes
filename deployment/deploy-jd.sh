cd /home/ubuntu/hardscapes-api
git checkout jd-prod
git pull
npm install
npm run build
sudo pm2 restart jdlandscaping-api --update-env
exit
