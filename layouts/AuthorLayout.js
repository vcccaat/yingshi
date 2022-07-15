import ProfileCard from '@/components/ProfileCard'
import TravelCard from '@/components/TravelCard'
import TravelsData from '@/data/travelsData'
import { PageSeo } from '@/components/SEO'

export default function AuthorLayout({ children, frontMatter }) {
  const { name, avatar } = frontMatter
  const travels = TravelsData.filter(({ type }) => type === 'self')
  return (
    <>
      <PageSeo title={`About - ${name}`} description={`About me - ${name}`} />
      <div className="divide-y">
        <div className="pt-6 pb-8 space-y-2 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            About
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            More about me and myself
          </p>
        </div>
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:space-y-0 pt-8">
          <ProfileCard avatar={avatar} />
          <div className="pb-8 xl:pl-8 prose prose-lg dark:prose-dark max-w-none xl:col-span-2">
            {children}
          </div>
        </div>
        <div className="divide-y">
          <div className="container py-12">
            <h3 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 mb-4">
              My Travel Footprints
            </h3>
            <div className="flex flex-wrap -m-4">
              {travels.map((travel) => (
                <TravelCard
                  key={travel.title}
                  title={travel.title}
                  imgSrc={travel.imgSrc}
                  href={travel.href}
                  date={travel.date}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
