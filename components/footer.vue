<style scoped>
.logo-text {
  font-style: italic;
}

/* quick “icon dots” placeholders (swap to real svgs later) */
.social-link {
  width: 38px;
  height: 38px;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 150ms ease, transform 150ms ease;
  padding: 5px;
  position: relative;
  z-index: 0;
  background-position: center;
  background-size: cover;
}


.social-link:hover {
  transform: translateY(-1px);
}
.social-link.instagram {
  background: #fff
  url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%230b1b2a' d='M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334'/%3E%3C/svg%3E")
  center / 20px 20px
  no-repeat;
}

.social-link.facebook {
  background: #fff
  url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%230b1b2a' d='M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951'/%3E%3C/svg%3E")
  center / 20px 20px
  no-repeat;
}
.social-link.linkedin {
  background: #fff
  url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%230b1b2a' d='M6.94 8.5H3.56V21h3.38zM5.25 3C4.14 3 3.3 3.85 3.3 4.89c0 1.03.83 1.89 1.93 1.89h.02c1.13 0 1.94-.86 1.94-1.89C7.19 3.85 6.38 3 5.25 3zM20.7 21h-3.38v-6.37c0-1.6-.57-2.69-2-2.69-1.09 0-1.74.73-2.02 1.44-.1.25-.13.6-.13.95V21h-3.38s.05-10.38 0-11.45h3.38v1.62c.45-.7 1.25-1.7 3.04-1.7 2.22 0 3.89 1.45 3.89 4.57z'/%3E%3C/svg%3E")
  center / 22px 22px
  no-repeat;
}

.social-link.youtube {
  background: #fff
  url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%230b1b2a' d='M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z'/%3E%3C/svg%3E")
  center / 20px 20px
  no-repeat;
}

@media(max-width: 768px) {
  .social-link-wrap {
    margin-bottom: 10px;
  }
}

/* yellow card style */
.signup-card {
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}
.signup-card * { position: relative}
.signup-card:after {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 95%;
  height: 200%;
  border-radius: 0 50% 50% 0;
  background: linear-gradient(90deg, #ffffff 0%, #f7c846 50%);
  z-index: 1;
  opacity: .5;
}

.community {
  font-style: italic;
}
</style>

<template>
  <footer class="w-full text-white bg-cetacean">
    <!-- main content -->
    <section class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 pt-16 py-10">
      <div class="flex flex-col lg:flex-row lg:justify-between gap-10 items-center">
        <!-- LEFT: logo + links -->
        <div class="flex flex-col lg:basis-1/3">
          <img
              class="logo sm:max-w-[400px] mr-auto sm:-ml-8"
              src="/footer-temp-logo.jpg"
              alt="Hartford Foundation Logo"
          />

          <span class="mt-2 text-md text-gray-300 logo-text">
            formerly Hartford Foundation for Public Giving
          </span>

          <div class="mt-10 flex flex-col sm:flex-row gap-6 sm:gap-36 lg:gap-24">
            <ul class="space-y-3 text-md">
              <li><a href="https://greaterhartfordgives.org/contact-us/" class="text-md hover:underline" target="_blank">Contact Us</a></li>
              <li><a href="https://greaterhartfordgives.org/careers/" class="text-md hover:underline" target="_blank">Careers</a></li>
              <li><a href="https://greaterhartfordgives.org/financial-strength/" class="text-md hover:underline" target="_blank">Our Finances</a></li>
            </ul>

            <ul class="space-y-3 text-md">
              <li class="text-gray-200 social-link-wrap">Social Links</li>

              <li>
                <div class="flex items-center gap-2">
                  <a class="social-link facebook" href="https://www.facebook.com/HartfordFoundation" target="_blank" aria-label="Facebook"></a>
                  <a class="social-link instagram" href="https://www.instagram.com/hartfordfoundation/" target="_blank" aria-label="Instagram"></a>
                  <a class="social-link linkedin" href="https://www.linkedin.com/company/hartford-foundation-for-public-giving/" target="_blank" aria-label="LinkedIn"></a>
                  <a class="social-link youtube" href="https://www.youtube.com/user/HartfordFoundation" target="_blank" aria-label="YouTube"></a>
                </div>
              </li>

              <li class="pt-4"><a href="https://greaterhartfordgives.org/privacy-policy/" class="hover:underline" target="_blank">Privacy Policy</a></li>
              <li><a href="https://greaterhartfordgives.org/terms-of-use/" class="hover:underline" target="_blank">Terms of Use</a></li>
            </ul>
          </div>
        </div>

        <!-- RIGHT: CTA card -->
        <div class="lg:basis-2/3 lg:flex w-full md:w-9/12 lg:w-auto lg:justify-end">
          <div class="signup-card w-full lg:max-w-[850px] bg-[#F4B400] text-[#0b1b2a] px-8 py-12">
            <h3 class="text-3xl font-extrabold z-10">
              Let's connect and collaborate.
            </h3>
            <p class="text-md mt-1 opacity-90 z-10">
              Get in touch with our team to learn more about our mission and how you can be a part of it.
            </p>

            <div class="mt-6">
                <a
                  href="https://greaterhartfordgives.org/contact-us/"
                  class="inline-block h-11 rounded-full px-8 text-sm font-extrabold bg-transparent border-black border-2 text-black hover:bg-black hover:text-white transition-colors duration-150 leading-[2.75rem] z-10"
                >
                CONNECT WITH US
                </a>
            </div>
          </div>
        </div>
      </div>

      <!-- bottom row -->
      <div class="flex justify-end">
        <span class="text-xs mt-8 lg:mt-0 text-gray-300">
          Copyright Information © 2025 Greater Hartford Gives Foundation.
        </span>
      </div>
    </section>
  </footer>
</template>

<script setup lang="ts">
</script>
