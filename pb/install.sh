DIR=$(dirname "$0")

function cleanup {
  rm $DIR/pb.zip
}
trap cleanup EXIT

curl -sL -o $DIR/pb.zip https://github.com/pocketbase/pocketbase/releases/download/v0.20.7/pocketbase_0.20.7_darwin_arm64.zip
unzip -p $DIR/pb.zip pocketbase >$DIR/pocketbase
chmod +x $DIR/pocketbase

echo "Installed pocketbase at '$DIR/pocketbase'. To get started, run:"

printf "\n$DIR/pocketbase serve\n\n"
