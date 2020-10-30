ROOT_DIR=$(git rev-parse --show-toplevel)
cd $ROOT_DIR

cp ./backend/.env.yaml ~/Google\ Drive/StatusAPI.env.yaml
echo 'done'
stat ~/Google\ Drive/StatusAPI.env.yaml