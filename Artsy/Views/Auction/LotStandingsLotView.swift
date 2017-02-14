import UIKit
import FLKAutoLayout
import SDWebImage

class LotStandingsLotView: UIView {
    typealias Config = (lotStanding: LotStanding, drawBottomBorder: Bool)

    @IBOutlet weak var bottomBorder: UIView!
    @IBOutlet weak var imageView: UIImageView!
    @IBOutlet weak var bidStatusLabel: UILabel!
    @IBOutlet weak var currentBidLabel: UILabel!
    @IBOutlet weak var numberOfBidsLabel: UILabel!
    @IBOutlet weak var lotNumberLabel: UILabel!
    @IBOutlet weak var artistNameLabel: UILabel!
    @IBOutlet weak var artworkNameLabel: UILabel!

    var config: Config? {
        didSet {
            setup()
        }
    }

    static func fromNib(isCompact: Bool, lotStanding: LotStanding, drawBottomBorder: Bool) -> LotStandingsLotView? {
        let nibName = "LotStandingsLotView" + (isCompact ? "Compact" : "Regular")
        let nib = UINib(nibName: nibName, bundle: nil)

        guard let views = nib.instantiate(withOwner: nil, options: nil) as? [UIView] else {
            return nil
        }
        guard let view = views.first as? LotStandingsLotView else {
            return nil
        }

        view.translatesAutoresizingMaskIntoConstraints = false
        view.config = (lotStanding: lotStanding, drawBottomBorder: drawBottomBorder)
        view.constrainHeight(isCompact ? "160" : "140")

        return view
    }
}

private typealias PrivateFunctions = LotStandingsLotView
extension LotStandingsLotView {
    func setup() {
        guard let config = config, let saleArtwork = config.lotStanding.saleArtwork else { return }

        // config-specific setup
        bottomBorder.isHidden = !config.drawBottomBorder
        imageView.sd_setImage(with: saleArtwork.artwork.urlForThumbnail())
        artworkNameLabel.text = saleArtwork.artwork.name()
        currentBidLabel.text = saleArtwork.currentBid.convertToDollarString(saleArtwork.currencySymbol)
        numberOfBidsLabel.text = saleArtwork.numberOfBidsString()

        if let lotNumber = saleArtwork.lotNumber {
            lotNumberLabel.text = "Lot \(lotNumber)"
        } else {
            lotNumberLabel.text = "No Lot Number" // TODO: Check on what force does here.
        }

        if let artist = saleArtwork.artwork.artist {
            artistNameLabel.text = artist.name
        } else {
            artistNameLabel.text = "No Artist" // TODO: Check on what force does here.
        }

        if config.lotStanding.isLeading {
            if saleArtwork.reserveStatus == .reserveNotMet {
                bidStatusLabel.textColor = .artsyYellowBold()
            } else {
                bidStatusLabel.textColor = UIColor.auctionGreen()
            }
        } else {
            bidStatusLabel.text = "Outbid"
            bidStatusLabel.textColor = .auctionRed()
        }

        // UI setup that's hard to do in Interface Builder
        currentBidLabel.font = UIFont.serifBoldFont(withSize: currentBidLabel.font.pointSize)
        artistNameLabel.font = UIFont.serifBoldFont(withSize: artistNameLabel.font.pointSize)
        lotNumberLabel.font = UIFont.sansSerifFont(withSize: 12)
    }
}
