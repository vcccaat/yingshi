import Image from './Image'
import Link from './Link'

const TravelCard = ({ title, imgSrc, href, date }) => (
  <div className="p-4 md:w-1/3 md" style={{ maxWidth: '544px' }}>
    <div className="h-full overflow-hidden border-2 shadow-md shadow-indigo-500/40 dark:hover:border-gray-400 dark:border-gray-600 border-gray-400 hover:border-gray-500 rounded-md border-opacity-60">
      <Image
        alt={title}
        src={imgSrc}
        className="object-cover object-center lg:h-48 md:h-36"
        width={1088}
        height={612}
      />
      <div className="p-6">
        <div className="flex justify-between mb-3">
          <h2 className="text-xl font-bold leading-8 ">
            {href ? (
              <Link href={href} aria-label={`Link to ${title}`}>
                {title}
              </Link>
            ) : (
              title
            )}
          </h2>
        </div>
        <p className="mb-3 prose text-gray-500 max-w-none dark:text-gray-400">{date}</p>
      </div>
    </div>
  </div>
)

export default TravelCard
