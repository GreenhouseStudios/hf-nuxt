mv nuxt.config.ts nuxt.config.ts.bak
mv wpnuxt.config.ts nuxt.config.ts
npm run generate
mkdir -p ~/dx/hf-wp/public_html/wp-content/themes/i3-hf-centennial/dist
rm -rf ~/dx/hf-wp/public_html/wp-content/themes/i3-hf-centennial/dist/*
mv .output/public/index.html ~/dx/hf-wp/public_html/wp-content/themes/i3-hf-centennial/dist/index.php
cp -r .output/public/* ~/dx/hf-wp/public_html/wp-content/themes/i3-hf-centennial/dist/
mv nuxt.config.ts wpnuxt.config.ts
mv nuxt.config.ts.bak nuxt.config.ts