cd /home/ubuntu/hardscapes-api
git checkout uh-prod
git pull
npm install
npm run build
sudo pm2 restart unitedhardscapes-api --update-env
exit
