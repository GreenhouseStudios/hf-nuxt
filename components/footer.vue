<template>
    <footer class="max-w-screen border-t-2 border-gray-300 mt-56 bg-blue-950 text-white">
        <section class="container mx-auto px-14 lg:px-0 py-30 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <about class="col-span-2 mb-10 lg:mb-0"></about>
            <!-- <address></address> -->
            <div class="flex flex-col gap-4 justify-start col-span-2 md:col-span-1">
                <div>860-548-1888</div>
                <div>
                    10 Columbus Boulevard, 8th Floor<br>
                    Hartford, CT 06106
                </div>
                <div><a>General Contact Information</a></div>
                <div><a>Careers</a></div>
            </div>
            <div class="col-span-2 md:col-span-1">
                <SocialMediaIcons></SocialMediaIcons>
                <div class="border-t-2 border-gray-300 mt-8 py-4">
                    <a href="">
                        <span class="uppercase block">Disinvested</span>
                        <span>A Hartford Foundation Podcast</span>
                    </a>
                </div>
            </div>
        </section>
        <SiteLinks></SiteLinks>
    </footer>
</template>