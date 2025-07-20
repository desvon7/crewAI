interface NavigationItem {
  name: string;
  href: string;
};

export default function Footer({ footerNavigation }: {
  footerNavigation: {
    app: NavigationItem[]
    company: NavigationItem[]
  }
}) {
  return (
    <div className='section mx-auto max-w-7xl px-6 lg:px-8'>
      <footer
        aria-labelledby='footer-heading'
        className='relative border-t border-neutral-200 dark:border-gray-200/10 py-16 bg-white dark:bg-boxdark-2 rounded-t-2xl shadow-t-lg'>
        <h2 id='footer-heading' className='sr-only'>
          Footer
        </h2>
        <div className='flex flex-col md:flex-row items-start justify-between mt-10 gap-20'>
          <div>
            <h3 className='text-sm font-semibold leading-6 text-gray-900 dark:text-white font-inter'>App</h3>
            <ul role='list' className='mt-6 space-y-4'>
              {footerNavigation.app.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className='text-sm leading-6 text-neutral hover:text-accent dark:text-white font-inter transition-colors'>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className='text-sm font-semibold leading-6 text-gray-900 dark:text-white font-inter'>Company</h3>
            <ul role='list' className='mt-6 space-y-4'>
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className='text-sm leading-6 text-neutral hover:text-accent dark:text-white font-inter transition-colors'>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className='mt-12 text-center text-xs text-neutral-400 font-inter'>
          © {new Date().getFullYear()} CrewAI Visual Builder. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
