use serde_derive::Deserialize;
use std::fs;
use std::process::exit;
use toml;

pub const G_CONSTANT: f64 = 6.67e-11;
pub const PARAMS: &str = "
[halo]
M_halo = 100e24
N_halo = 20000
a_halo = 1e8
halo_cut_r = 900
gamma_halo = 1

[disk]
M_disk = 1e20
N_disk = 10000
Rd = 10
z0 = 0.7
factor = 0.8
disk_cut_r = 30

[bulge]
M_bulge = 1e24
N_bulge = 4000
a_bulge = 1.5e10
bulge_cut_r = 30
gamma_bulge = 1

[global]
N_rho = 256
rho_max = 300
Nz = 256
z_max = 3000
";

#[derive(Deserialize, Debug)]
pub struct Config {
    pub halo: HaloConfig,
    pub disk: DiskConfig,
    pub bulge: BulgeConfig,
    pub global: GlobalConfig,
}
#[derive(Deserialize, Debug)]
pub struct HaloConfig {
    pub M_halo: f64,
    pub N_halo: i32,
    pub a_halo: f64,
    pub halo_cut_r: f64,
    pub gamma_halo: i32,
}

#[derive(Deserialize, Debug)]
pub struct DiskConfig {
    pub M_disk: f64,
    pub N_disk: i32,
    pub Rd: f64,
    pub z0: f64,
    pub factor: f64,
    pub disk_cut_r: f64,
}

#[derive(Deserialize, Debug)]
pub struct BulgeConfig {
    pub M_bulge: f64,
    pub N_bulge: i32,
    pub a_bulge: f64,
    pub bulge_cut_r: f64,
    pub gamma_bulge: i32,
}

#[derive(Deserialize, Debug)]
pub struct GlobalConfig {
    pub N_rho: f64,
    pub rho_max: f64,
    pub Nz: f64,
    pub z_max: f64,
}

pub fn generate_config() -> Config {
    match toml::from_str(PARAMS) {
        Ok(d) => d,
        Err(e) => {
            eprintln!("Unable to load data {}", e);
            exit(1);
        }
    }
}
