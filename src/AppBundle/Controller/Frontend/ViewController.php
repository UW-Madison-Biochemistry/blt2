<?php


namespace AppBundle\Controller\Frontend;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class ViewController extends Controller
{
    /**
     * Route to render the view page
     *
     * @Route("/view", name="view")
     */
    public function renderTemplateAction() {
        return $this->render('view.html.twig');
    }
}