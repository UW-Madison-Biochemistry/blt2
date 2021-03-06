<?php


namespace AppBundle\Controller\Frontend;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DeliveringController extends Controller {

    /**
     * Route to render the delivering page
     *
     * @Route("/delivering", name="delivering")
     */
    public function renderTemplateAction() {
        return $this->render('delivering.html.twig');
    }

}