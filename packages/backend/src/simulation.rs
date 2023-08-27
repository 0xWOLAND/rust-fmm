extern crate console_error_panic_hook;
use std::panic;
use wasm_bindgen::prelude::wasm_bindgen;

use crate::{config::AU, fmm::Point, ic::plummer, octree::Grid, utils::to_texture};

#[wasm_bindgen]
pub fn simulate(n: usize, a: f64, M: f64, width: usize, height: usize) -> js_sys::Uint8Array {
    panic::set_hook(Box::new(console_error_panic_hook::hook));

    let ic = plummer(n, Some(a), Some(M));

    let mut g = Grid::new(AU / 10., AU);
    for particle in &ic {
        g.insert_particle(&particle.p, particle.mass);
    }
    to_texture(ic, width, height)
}

#[wasm_bindgen]
pub fn get_scale_length() -> f64 {
    AU
}

#[cfg(test)]
mod tests {

    use crate::{config::AU, fmm::Point, octree::Grid, simulation::simulate};

    #[test]
    fn test_two_particle() {
        let mut g = Grid::new(2., AU);
        let mass = 10.;

        let p_1 = Point::new(0., 0., 0.);
        let p_2 = Point::new(2., 0., 0.);

        g.insert_particle(&p_1, mass);
        g.insert_particle(&p_2, mass);

        let a_1 = g.get_acceleration(&p_1);
        let a_2 = g.get_acceleration(&p_2);

        println!("a_1: {:?}", a_1);
        println!("a_2: {:?}", a_2);
    }

    #[test]
    fn test_simulate() {
        println!("{:?}", simulate(10, 5., 5., 10000, 10000));
    }
}
