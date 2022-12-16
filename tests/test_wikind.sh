set -e

git clone https://github.com/Kindelia/Wikind.git

for file in ./Wikind/**/*.kind2; do
    kind2 --root=Wikind check $file
done

rm Wikind