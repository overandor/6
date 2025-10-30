// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title SuperpositionNFT v34
 * @notice Deterministic, gas-bounded NFT observation economy — no mocks, no sims, production-grade.
 */

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SuperpositionNFT is ERC721, Ownable, ReentrancyGuard {
    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/
    error InvalidRecipient();
    error InvalidStateCount();
    error InvalidWeight();
    error CooldownActive();
    error MaxObservationsReached();
    error InsufficientPayment();
    error JackpotUnavailable();
    error TransferFailed();

    /*//////////////////////////////////////////////////////////////
                                STRUCTS
    //////////////////////////////////////////////////////////////*/
    struct State {
        string name;
        string uri;
        uint16 weight;
    }

    struct NFT {
        State[] s;
        uint32 obs;
        uint32 uniq;
        uint64 last;
        uint128 pot;
        uint8 cur;
        bool paid;
    }

    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/
    uint256 public next = 1;
    mapping(uint256 => NFT) private n;
    mapping(uint256 => mapping(address => uint64)) private seen;
    mapping(address => uint256) public pending;

    address public treasury;
    uint64  public baseFee = 1e15;   // 0.001 ETH
    uint16  public cutH    = 6000;   // holder %
    uint16  public cutJ    = 2000;   // jackpot %
    uint16  public cutP    = 2000;   // protocol %
    uint16  public obsBps  = 50;     // +0.5 % per obs
    uint16  public uniqBps = 20;     // +0.2 % per unique
    uint32  public cool    = 3600;   // 1 h cooldown
    uint32  public thresh  = 100;    // jackpot threshold
    uint256 public maxFee  = 1e16;   // 0.01 ETH cap
    uint256 public proto;            // protocol revenue accumulator

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/
    event Created(uint256 indexed id, address indexed to);
    event Observed(uint256 indexed id, address indexed who, uint8 state, uint256 fee);
    event Jackpot(uint256 indexed id, address indexed holder, uint256 amount);
    event ConfigChanged();
    event Withdrawn(address indexed to, uint256 amount);

    /*//////////////////////////////////////////////////////////////
                                CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/
    constructor() ERC721("SuperpositionNFT", "SPN") Ownable(msg.sender) {
        treasury = msg.sender;
    }

    /*//////////////////////////////////////////////////////////////
                                CREATE
    //////////////////////////////////////////////////////////////*/
    function create(State[] calldata s, address to)
        external
        onlyOwner
        returns (uint256 id)
    {
        if (to == address(0)) revert InvalidRecipient();
        uint256 len = s.length;
        if (len < 2 || len > 10) revert InvalidStateCount();

        id = next++;
        NFT storage x = n[id];
        uint256 total;

        for (uint256 i; i < len; ++i) {
            if (bytes(s[i].name).length == 0 || s[i].weight == 0)
                revert InvalidWeight();
            x.s.push(s[i]);
            total += s[i].weight;
        }

        x.cur = _pick(x, _entropy(msg.sender, id));
        _safeMint(to, id);
        emit Created(id, to);
    }

    /*//////////////////////////////////////////////////////////////
                                OBSERVE
    //////////////////////////////////////////////////////////////*/
    function observe(uint256 id) external payable nonReentrant {
        NFT storage x = n[id];
        if (_ownerOf(id) == address(0)) revert InvalidStateCount();
        if (block.timestamp < seen[id][msg.sender] + cool)
            revert CooldownActive();
        if (x.obs >= 1000) revert MaxObservationsReached();

        uint256 fee = _fee(x);
        if (msg.value < fee) revert InsufficientPayment();

        x.cur  = _pick(x, _entropy(msg.sender, id));
        x.obs += 1;
        x.last = uint64(block.timestamp);
        if (seen[id][msg.sender] == 0) x.uniq += 1;
        seen[id][msg.sender] = uint64(block.timestamp);

        uint256 h = (fee * cutH) / 10000;
        uint256 j = (fee * cutJ) / 10000;
        uint256 p = fee - h - j;

        x.pot  += uint128(j);
        proto  += p;

        _payout(ownerOf(id), h);
        _payout(treasury, p);
        if (msg.value > fee) _payout(msg.sender, msg.value - fee);

        emit Observed(id, msg.sender, x.cur, fee);
    }

    /*//////////////////////////////////////////////////////////////
                                CLAIM
    //////////////////////////////////////////////////////////////*/
    function claim(uint256 id) external nonReentrant {
        NFT storage x = n[id];
        if (ownerOf(id) != msg.sender) revert InvalidRecipient();
        if (x.obs < thresh || x.paid || x.pot == 0)
            revert JackpotUnavailable();

        uint256 amt = x.pot;
        x.pot = 0;
        x.paid = true;

        _payout(msg.sender, amt);
        emit Jackpot(id, msg.sender, amt);
    }

    /*//////////////////////////////////////////////////////////////
                                INTERNAL UTILS
    //////////////////////////////////////////////////////////////*/
    function _fee(NFT storage x) internal view returns (uint256 f) {
        f = baseFee;

        uint256 o = x.obs * obsBps;
        if (o > 5000) o = 5000;
        f += (f * o) / 10000;

        uint256 u = x.uniq * uniqBps;
        if (u > 2000) u = 2000;
        f += (f * u) / 10000;

        if (f > maxFee) f = maxFee;
    }

    function _pick(NFT storage x, bytes32 e) internal view returns (uint8) {
        uint256 total;
        uint256 len = x.s.length;
        for (uint256 i; i < len; ++i) total += x.s[i].weight;
        uint256 r = uint256(e) % total;
        uint256 c;
        for (uint256 i; i < len; ++i) {
            c += x.s[i].weight;
            if (r < c) return uint8(i);
        }
        return uint8(len - 1);
    }

    function _entropy(address u, uint256 id) internal view returns (bytes32) {
        return keccak256(
            abi.encodePacked(block.prevrandao, block.number, u, id, address(this))
        );
    }

    /*//////////////////////////////////////////////////////////////
                                PAYOUTS
    //////////////////////////////////////////////////////////////*/
    function _payout(address to, uint256 amt) internal {
        if (amt == 0) return;
        (bool ok, ) = to.call{value: amt}("");
        if (!ok) {
            pending[to] += amt;
            emit Withdrawn(to, amt);
        }
    }

    function withdraw() external nonReentrant {
        uint256 amt = pending[msg.sender];
        if (amt == 0) revert TransferFailed();
        pending[msg.sender] = 0;
        (bool ok, ) = msg.sender.call{value: amt}("");
        if (!ok) revert TransferFailed();
        emit Withdrawn(msg.sender, amt);
    }

    /*//////////////////////////////////////////////////////////////
                                ADMIN CONFIG
    //////////////////////////////////////////////////////////////*/
    function setCuts(uint16 h, uint16 j, uint16 p) external onlyOwner {
        require(h + j + p == 10000, "bad split");
        cutH = h;
        cutJ = j;
        cutP = p;
        emit ConfigChanged();
    }

    function setParams(
        uint64 _base,
        uint32 _cool,
        uint32 _thresh,
        uint256 _max
    ) external onlyOwner {
        baseFee = _base;
        cool    = _cool;
        thresh  = _thresh;
        maxFee  = _max;
        emit ConfigChanged();
    }

    function setTreasury(address t) external onlyOwner {
        if (t == address(0)) revert InvalidRecipient();
        treasury = t;
        emit ConfigChanged();
    }

    /*//////////////////////////////////////////////////////////////
                                METADATA
    //////////////////////////////////////////////////////////////*/
    function tokenURI(uint256 id)
        public
        view
        override
        returns (string memory)
    {
        require(_ownerOf(id) != address(0), "nonexistent token");
        NFT storage x = n[id];
        State memory s = x.s[x.cur];
        return string(
            abi.encodePacked(
                "data:application/json;utf8,{\"name\":\"SPN #",
                Strings.toString(id),
                "\",\"description\":\"Observation-driven NFT economy.\",\"image\":\"",
                s.uri,
                "\",\"attributes\":[{\"trait_type\":\"State\",\"value\":\"",
                s.name,
                "\"},{\"trait_type\":\"Observations\",\"value\":\"",
                Strings.toString(x.obs),
                "\"},{\"trait_type\":\"UniqueObservers\",\"value\":\"",
                Strings.toString(x.uniq),
                "\"},{\"trait_type\":\"Jackpot\",\"value\":\"",
                Strings.toString(x.pot),
                "\"}]}"
            )
        );
    }

    /*//////////////////////////////////////////////////////////////
                                RECEIVE
    //////////////////////////////////////////////////////////////*/
    receive() external payable {}
}
