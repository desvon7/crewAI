interface Feature {
  name: string;
  description: string;
  icon: string;
  href: string;
};

export default function Features({ features }: { features: Feature[] }) {
  return (
    <div id='features' className='section mx-auto max-w-7xl px-6 lg:px-8'>
      <div className='mx-auto max-w-2xl text-center'>
        <p className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white font-inter'>
          The <span className='text-accent'>Best</span> Features
        </p>
        <p className='mt-6 text-lg leading-8 text-neutral dark:text-white font-inter'>
          Don't work harder.<br />Work smarter.
        </p>
      </div>
      <div className='mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl'>
        <dl className='grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16'>
          {features.map((feature) => (
            <div key={feature.name} className='relative pl-16 card-modern hover:scale-105 hover:shadow-2xl transition-transform duration-300'>
              <dt className='text-base font-semibold leading-7 text-gray-900 dark:text-white font-inter'>
                <div className='absolute left-0 top-0 flex h-12 w-12 items-center justify-center border-2 border-accent bg-orange-100/60 dark:bg-boxdark rounded-xl shadow-md'>
                  <div className='text-2xl text-accent'>{feature.icon}</div>
                </div>
                {feature.name}
              </dt>
              <dd className='mt-2 text-base leading-7 text-neutral dark:text-white font-inter'>{feature.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
