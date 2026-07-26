package logistics

type Provinsi struct {
	ID     uint   `gorm:"primaryKey" json:"id"`
	Name   string `gorm:"size:100;not null;column:name" json:"name"`
	Status string `gorm:"size:10;not null;default:Active" json:"status"`
}

type Kabupaten struct {
	ID     uint   `gorm:"primaryKey" json:"id"`
	Name   string `gorm:"size:100;not null;column:name" json:"name"`
	Status string `gorm:"size:10;not null;default:Active" json:"status"`
}

type Kecamatan struct {
	ID     uint   `gorm:"primaryKey" json:"id"`
	Name   string `gorm:"size:100;not null;column:name" json:"name"`
	Status string `gorm:"size:10;not null;default:Active" json:"status"`
}

type Kelurahan struct {
	ID     uint   `gorm:"primaryKey" json:"id"`
	Name   string `gorm:"size:100;not null;column:name" json:"name"`
	Status string `gorm:"size:10;not null;default:Active" json:"status"`
}

type KodePos struct {
	ID     uint   `gorm:"primaryKey" json:"id"`
	Code   string `gorm:"size:10;not null;column:code" json:"code"`
	Status string `gorm:"size:10;not null;default:Active" json:"status"`
}

type Pemasaran struct {
	ID       uint       `gorm:"primaryKey" json:"id"`
	Name     string     `gorm:"size:100;not null;column:name" json:"name"`
	Address  string     `gorm:"column:address" json:"address"`
	KTP      string     `gorm:"size:20;column:ktp" json:"ktp"`
	Phone    string     `gorm:"size:20;column:phone" json:"phone"`
	BranchID *uint      `gorm:"index;column:branch_id" json:"branch_id"`
	Branch   *CabangRef `gorm:"foreignKey:BranchID" json:"branch,omitempty"`
	Status   string     `gorm:"size:10;not null;default:Active" json:"status"`
}

type Driver struct {
	ID       uint       `gorm:"primaryKey" json:"id"`
	Name     string     `gorm:"size:100;not null;column:name" json:"name"`
	Address  string     `gorm:"column:address" json:"address"`
	KTP      string     `gorm:"size:20;column:ktp" json:"ktp"`
	SIM      string     `gorm:"size:20;column:sim" json:"sim"`
	Phone    string     `gorm:"size:20;column:phone" json:"phone"`
	BranchID *uint      `gorm:"index;column:branch_id" json:"branch_id"`
	Branch   *CabangRef `gorm:"foreignKey:BranchID" json:"branch,omitempty"`
	Status   string     `gorm:"size:10;not null;default:Active" json:"status"`
}

type Kurir struct {
	ID       uint       `gorm:"primaryKey" json:"id"`
	Name     string     `gorm:"size:100;not null;column:name" json:"name"`
	Address  string     `gorm:"column:address" json:"address"`
	KTP      string     `gorm:"size:20;column:ktp" json:"ktp"`
	Phone    string     `gorm:"size:20;column:phone" json:"phone"`
	BranchID *uint      `gorm:"index;column:branch_id" json:"branch_id"`
	Branch   *CabangRef `gorm:"foreignKey:BranchID" json:"branch,omitempty"`
	Status   string     `gorm:"size:10;not null;default:Active" json:"status"`
}

type Moda struct {
	ID      uint   `gorm:"primaryKey" json:"id"`
	Name    string `gorm:"size:100;not null;column:name" json:"name"`
	Divider string `gorm:"size:100;not null;column:divider" json:"divider"`
	Status  string `gorm:"size:10;not null;default:Active" json:"status"`
}

type KategoriLayanan struct {
	ID     uint   `gorm:"primaryKey" json:"id"`
	Name   string `gorm:"size:100;not null;column:name" json:"name"`
	Status string `gorm:"size:10;not null;default:Active" json:"status"`
}

type LayananPengantaran struct {
	ID                uint             `gorm:"primaryKey" json:"id"`
	Name              string           `gorm:"size:100;not null;column:name" json:"name"`
	ServiceCategoryID *uint            `gorm:"index;column:service_category_id" json:"service_category_id"`
	ServiceCategory   *KategoriLayanan `gorm:"foreignKey:ServiceCategoryID" json:"service_category,omitempty"`
	ModaID            *uint            `gorm:"index;column:moda_id" json:"moda_id"`
	Moda              *Moda            `gorm:"foreignKey:ModaID" json:"moda,omitempty"`
	Status            string           `gorm:"size:10;not null;default:Active" json:"status"`
}

type JenisBarang struct {
	ID     uint   `gorm:"primaryKey" json:"id"`
	Name   string `gorm:"size:100;not null;column:name" json:"name"`
	Status string `gorm:"size:10;not null;default:Active" json:"status"`
}

type JenisBiaya struct {
	ID     uint   `gorm:"primaryKey" json:"id"`
	Name   string `gorm:"size:100;not null;column:name" json:"name"`
	Status string `gorm:"size:10;not null;default:Active" json:"status"`
}

type Termin struct {
	ID         uint   `gorm:"primaryKey" json:"id"`
	Name       string `gorm:"size:100;not null;column:name" json:"name"`
	Keterangan string `gorm:"size:100;not null;column:description" json:"description"`
	Status     string `gorm:"size:10;not null;default:Active" json:"status"`
}

// #kendaraan

type CabangRef struct {
	ID uint `gorm:"primaryKey" json:"id"`
}

func (CabangRef) TableName() string { return "cabangs" }

type Kendaraan struct {
	ID                uint           `gorm:"primaryKey" json:"id"`
	Name              string         `gorm:"size:100;not null;column:name" json:"name"`
	JenisTruckingID   *uint          `gorm:"index;column:jenis_trucking_id" json:"jenis_trucking_id"`
	JenisTrucking     *JenisTrucking `gorm:"foreignKey:JenisTruckingID" json:"jenis_trucking,omitempty"`
	Year              int            `gorm:"column:year" json:"year"`
	NoPolisi          string         `gorm:"size:20;column:no_polisi" json:"no_polisi"`
	STNKName          string         `gorm:"size:100;column:stnk_name" json:"stnk_name"`
	STNKNumber        string         `gorm:"size:50;column:stnk_number" json:"stnk_number"`
	STNKDate          *string        `gorm:"column:stnk_date" json:"stnk_date"`
	CylinderCapacity  string         `gorm:"size:50;column:cylinder_capacity" json:"cylinder_capacity"`
	Color             string         `gorm:"size:50;column:color" json:"color"`
	InsuranceName     string         `gorm:"size:100;column:insurance_name" json:"insurance_name"`
	InsuranceExpiry   *string        `gorm:"column:insurance_expiry" json:"insurance_expiry"`
	Description       string         `gorm:"column:description" json:"description"`
	ChassisNumber     string         `gorm:"size:100;column:chassis_number" json:"chassis_number"`
	EngineNumber      string         `gorm:"size:100;column:engine_number" json:"engine_number"`
	IsActive          bool           `gorm:"default:true;column:is_active" json:"is_active"`
	ServiceTrucking   bool           `gorm:"default:false;column:service_trucking" json:"service_trucking"`
	BranchID          *uint          `gorm:"index;column:branch_id" json:"branch_id"`
	Branch            *CabangRef     `gorm:"foreignKey:BranchID" json:"branch,omitempty"`
}

type JenisKendaraan struct {
	ID     uint   `gorm:"primaryKey" json:"id"`
	Name   string `gorm:"size:100;not null;column:name" json:"name"`
	Status string `gorm:"size:10;not null;default:Active" json:"status"`
}

type JenisTrucking struct {
	ID     uint   `gorm:"primaryKey" json:"id"`
	Name   string `gorm:"size:100;not null;column:name" json:"name"`
	Status string `gorm:"size:10;not null;default:Active" json:"status"`
}

// #shipmentstatus

type ShipmentStatus struct {
	ID     uint   `gorm:"primaryKey" json:"id"`
	Code   string `gorm:"size:20;not null;column:code" json:"code"`
	Name   string `gorm:"size:100;not null;column:name" json:"name"`
	Status string `gorm:"size:10;not null;default:Active" json:"status"`
}
